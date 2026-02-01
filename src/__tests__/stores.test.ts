import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useBlogStore, type BlogPost } from '../store/blogStore';
import { useCommentStore } from '../store/commentStore';
import { useNewsletterStore } from '../store/newsletterStore';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { ADMIN_USERNAME } from '../constants';
import { hashEmail, hashPassword, loginRateLimiter } from '../utils/crypto';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const baseSettings = clone(useSettingsStore.getState().settings);
baseSettings.adminPassword = '';
const baseSettingsActions = {
  updateSettings: useSettingsStore.getState().updateSettings,
  updateTheme: useSettingsStore.getState().updateTheme,
  updatePageContent: useSettingsStore.getState().updatePageContent,
};

const samplePost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: 'sample-post',
  title: 'Sample Post',
  excerpt: 'Excerpt',
  content: 'Content',
  publishedAt: new Date('2024-01-01').toISOString(),
  status: 'published',
  tags: ['test'],
  icon: 'cat',
  source: 'local',
  ...overrides,
});

describe('stores', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage?.clear();
      window.sessionStorage?.clear?.();
    }
    useBlogStore.setState({ posts: [] });
    useCommentStore.setState({ comments: [] });
    useNewsletterStore.setState({ subscribers: [] });
    useSettingsStore.setState({
      settings: clone(baseSettings),
      ...baseSettingsActions,
    } as never);
    useAuthStore.setState({ isAuthenticated: false, sessionExpiresAt: null, sessionExpired: false });
    loginRateLimiter.reset(ADMIN_USERNAME);
    (globalThis as { __ENV__?: Record<string, string> }).__ENV__ = {};
  });

  it('manages blog posts', () => {
    const addPost = useBlogStore.getState().addPost;
    const editPost = useBlogStore.getState().editPost;
    const deletePost = useBlogStore.getState().deletePost;

    addPost({
      title: 'Hello World',
      excerpt: 'Hello',
      content: 'Hello content',
      icon: 'cat',
      tags: [],
      status: 'published',
      publishedAt: '',
      coverImage: undefined,
    });
    expect(useBlogStore.getState().posts.length).toBe(1);
    const created = useBlogStore.getState().posts[0];
    expect(created.readTime).toBeDefined();

    editPost(created.id, { title: 'Updated', content: 'Updated content' });
    const updated = useBlogStore.getState().posts[0];
    expect(updated.title).toBe('Updated');

    deletePost(created.id);
    expect(useBlogStore.getState().posts.length).toBe(0);
  });

  it('uses blog post defaults and preserves read time on edit', () => {
    const addPost = useBlogStore.getState().addPost;
    addPost({
      title: ' ',
      excerpt: '',
      content: 'Some content',
      icon: 'cat',
      tags: undefined as unknown as string[],
      status: '' as unknown as BlogPost['status'],
      publishedAt: '',
      coverImage: undefined,
      readTime: undefined,
    } as unknown as Omit<BlogPost, 'id' | 'source'>);
    const created = useBlogStore.getState().posts[0];
    expect(created.id.startsWith('post-')).toBe(true);
    expect(created.status).toBe('published');
    expect(created.tags).toEqual([]);
    expect(created.publishedAt).toBeTruthy();
    const readTimeBefore = created.readTime;
    useBlogStore.getState().editPost(created.id, { title: 'Edited title' });
    const updated = useBlogStore.getState().posts[0];
    expect(updated.readTime).toBe(readTimeBefore);
  });

  it('leaves other posts unchanged when editing', () => {
    useBlogStore.setState({
      posts: [
        samplePost({ id: 'first', title: 'First' }),
        samplePost({ id: 'second', title: 'Second' }),
      ],
    });
    useBlogStore.getState().editPost('first', { title: 'Updated' });
    const posts = useBlogStore.getState().posts;
    const untouched = posts.find((post) => post.id === 'second');
    expect(untouched?.title).toBe('Second');
  });

  it('migrates blog posts', () => {
    const migrate = (useBlogStore as unknown as { persist: { getOptions: () => { migrate: (state: unknown) => unknown } } })
      .persist.getOptions().migrate;
    expect(migrate(null)).toBeNull();
    expect(migrate({ posts: 'bad' })).toEqual({ posts: 'bad' });
    const migrated = migrate({
      posts: [
        samplePost({
          tags: undefined,
          status: undefined,
          publishedAt: '',
          source: undefined,
          readTime: undefined,
          content: '',
        }),
      ],
    }) as { posts: BlogPost[] };
    expect(migrated.posts[0].tags).toEqual([]);
    expect(migrated.posts[0].status).toBe('published');
    expect(migrated.posts[0].publishedAt).toBeTruthy();
    expect(migrated.posts[0].readTime).toBeDefined();
  });

  it('validates and stores comments', () => {
    const addComment = useCommentStore.getState().addComment;
    expect(addComment('post', '', 'a@b.com', 'content').success).toBe(false);
    expect(addComment('post', 'Name', 'bad', 'content').success).toBe(false);
    expect(addComment('post', 'Name', 'a@b.com', 'short').success).toBe(false);
    expect(addComment('post', 'Name', 'a@b.com', 'x'.repeat(1001)).success).toBe(false);

    const result = addComment('post', 'Name', 'a@b.com', 'This is a valid comment');
    expect(result.success).toBe(true);
    expect(useCommentStore.getState().comments.length).toBe(1);

    const sorted = useCommentStore.getState().getCommentsByPostId('post');
    expect(sorted.length).toBe(1);
    const commentId = sorted[0].id;
    useCommentStore.getState().deleteComment(commentId);
    expect(useCommentStore.getState().comments.length).toBe(0);
  });

  it('migrates comments by removing emails', () => {
    const migrate = (useCommentStore as unknown as { persist: { getOptions: () => { migrate: (state: unknown) => unknown } } })
      .persist.getOptions().migrate;
    expect(migrate(null)).toBeNull();
    expect(migrate({ comments: 'bad' })).toEqual({ comments: 'bad' });
    const migrated = migrate({
      comments: [{ id: '1', postId: 'p', author: 'A', content: 'C', createdAt: 'now', email: 'a@b.com' }],
    }) as { comments: Array<{ email?: string }> };
    expect(migrated.comments[0].email).toBeUndefined();
    const migratedMixed = migrate({ comments: ['bad'] }) as { comments: unknown[] };
    expect(migratedMixed.comments[0]).toBe('bad');
  });

  it('manages newsletter subscriptions without endpoint', async () => {
    const subscribe = useNewsletterStore.getState().subscribe;
    const isSubscribed = useNewsletterStore.getState().isSubscribed;
    const bad = await subscribe('bad');
    expect(bad.success).toBe(false);

    const ok = await subscribe('user@example.com');
    expect(ok.success).toBe(true);
    expect(await isSubscribed('user@example.com')).toBe(true);
    const dup = await subscribe('user@example.com');
    expect(dup.success).toBe(false);
    expect(await isSubscribed('bad')).toBe(false);
  });

  it('migrates newsletter subscribers', () => {
    const migrate = (useNewsletterStore as unknown as { persist: { getOptions: () => { migrate: (state: unknown) => unknown } } })
      .persist.getOptions().migrate;
    expect(migrate(null)).toBeNull();
    expect(migrate({ subscribers: 'bad' })).toEqual({ subscribers: 'bad' });
    const migrated = migrate({
      subscribers: [{ emailHash: '', subscribedAt: 'now' }],
    }) as { subscribers: Array<{ emailHash: string }> };
    expect(migrated.subscribers).toEqual([]);
    const migratedOk = migrate({
      subscribers: [{ emailHash: 'hash', subscribedAt: 'now' }],
    }) as { subscribers: Array<{ emailHash: string }> };
    expect(migratedOk.subscribers[0].emailHash).toBe('hash');
  });

  it('handles newsletter subscriptions with endpoint', async () => {
    (globalThis as { __ENV__?: Record<string, string> }).__ENV__ = {
      VITE_NEWSLETTER_ENDPOINT: 'https://example.com/subscribe',
    };
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const subscribe = useNewsletterStore.getState().subscribe;
    const isSubscribed = useNewsletterStore.getState().isSubscribed;
    const result = await subscribe('user@example.com');
    expect(result.success).toBe(true);

    fetchMock.mockResolvedValue({ ok: false });
    const fail = await subscribe('user@example.com');
    expect(fail.success).toBe(false);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValue(new Error('fail'));
    const rejected = await subscribe('user@example.com');
    expect(rejected.success).toBe(false);
    expect(await isSubscribed('user@example.com')).toBe(false);
    errorSpy.mockRestore();
    globalThis.fetch = originalFetch;
  });

  it('updates settings', () => {
    const { updateSettings, updateTheme, updatePageContent } = useSettingsStore.getState();
    updateSettings({ title: 'New Title' });
    expect(useSettingsStore.getState().settings.title).toBe('New Title');
    updateTheme({ primaryColor: '#000000' });
    expect(useSettingsStore.getState().settings.theme.primaryColor).toBe('#000000');
    updatePageContent('home', { jobTitle: 'Planner' });
    expect(useSettingsStore.getState().settings.content.home.jobTitle).toBe('Planner');
  });

  it('migrates settings with defaults', () => {
    const migrate = (useSettingsStore as unknown as { persist: { getOptions: () => { migrate: (state: unknown) => unknown } } })
      .persist.getOptions().migrate;
    expect(migrate(null)).toBeNull();
    expect(migrate({})).toEqual({});
    const migrated = migrate({ settings: { title: 'X' } }) as { settings: { title: string; seo: { siteUrl: string } } };
    expect(migrated.settings.title).toBe('X');
    expect(migrated.settings.seo).toBeDefined();
  });

  it('upgrades legacy auth hashes on login', async () => {
    const updateSettings = jest.fn();
    const legacyHash = await hashEmail('password123');
    useSettingsStore.setState({
      settings: { ...clone(baseSettings), adminPassword: legacyHash },
      updateSettings,
    } as never);
    const result = await useAuthStore.getState().login(ADMIN_USERNAME, 'password123');
    expect(result.success).toBe(true);
    expect(updateSettings).toHaveBeenCalled();
  });

  it('handles auth login flow', async () => {
    const { login, logout } = useAuthStore.getState();
    const resultNoPass = await login(ADMIN_USERNAME, 'Password123');
    expect(resultNoPass.success).toBe(false);

    const hash = await hashPassword('Password123');
    useSettingsStore.getState().updateSettings({ adminPassword: hash });
    const wrongUser = await login('wrong', 'Password123');
    expect(wrongUser.success).toBe(false);
    const ok = await login(ADMIN_USERNAME, 'Password123');
    expect(ok.success).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().sessionExpiresAt).toBeTruthy();
    logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('expires sessions after ttl', () => {
    const now = Date.now();
    useAuthStore.setState({
      isAuthenticated: true,
      sessionExpiresAt: now - 1000,
      sessionExpired: false,
    });
    const valid = useAuthStore.getState().ensureSession();
    expect(valid).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().sessionExpired).toBe(true);
  });

  it('rate limits login attempts', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    const hash = await hashPassword('Password123');
    useSettingsStore.getState().updateSettings({ adminPassword: hash });
    const login = useAuthStore.getState().login;
    await login(ADMIN_USERNAME, 'wrong');
    await login(ADMIN_USERNAME, 'wrong');
    await login(ADMIN_USERNAME, 'wrong');
    const blocked = await login(ADMIN_USERNAME, 'wrong');
    expect(blocked.success).toBe(false);
    expect(blocked.error).toContain('Too many attempts');
    jest.advanceTimersByTime(299000);
    const blockedSoon = await login(ADMIN_USERNAME, 'wrong');
    expect(blockedSoon.error).toContain('second(s)');
    jest.useRealTimers();
  });
});
