import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { __testables, contentPosts, isPostVisible } from '../content/posts';
import type { Post } from '../types/post';

const { parseFrontmatter, normalizeTags, parsePublishedAt, buildContentPosts } = __testables;

describe('content posts utilities', () => {
  it('parses frontmatter', () => {
    const raw = `---\ntitle: Hello\nexcerpt: Sample\n---\nBody text`;
    const result = parseFrontmatter(raw);
    expect(result.data.title).toBe('Hello');
    expect(result.content).toBe('Body text');
  });

  it('handles empty frontmatter blocks', () => {
    const result = parseFrontmatter('---\n\n---\nBody text');
    expect(result.data).toEqual({});
    expect(result.content).toBe('Body text');
  });

  it('handles missing frontmatter', () => {
    const result = parseFrontmatter('Just content');
    expect(result.data).toEqual({});
    expect(result.content).toBe('Just content');
  });

  it('normalizes tags', () => {
    expect(normalizeTags(['Cats', 'Dogs'])).toEqual(['cats', 'dogs']);
    expect(normalizeTags('Cats, Dogs')).toEqual(['cats', 'dogs']);
    expect(normalizeTags()).toEqual([]);
  });

  it('parses published dates', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    expect(parsePublishedAt({ date: '2024-02-01' })).toContain('2024-02-01');
    expect(parsePublishedAt({ publishedAt: 'bad-date' })).toContain('2024-01-01');
    expect(parsePublishedAt({})).toContain('2024-01-01');
    jest.useRealTimers();
  });

  it('evaluates post visibility', () => {
    const now = new Date('2024-01-10T00:00:00Z');
    const draft: Post = {
      id: 'd',
      title: 'Draft',
      excerpt: '',
      content: '',
      publishedAt: '2024-01-09T00:00:00Z',
      status: 'draft',
      tags: [],
      icon: 'cat',
      source: 'content',
    };
    const scheduled: Post = { ...draft, id: 's', status: 'scheduled', publishedAt: '2024-01-20T00:00:00Z' };
    const published: Post = { ...draft, id: 'p', status: 'published' };
    expect(isPostVisible(draft, now)).toBe(false);
    expect(isPostVisible(scheduled, now)).toBe(false);
    expect(isPostVisible(published, now)).toBe(true);
  });

  it('exposes contentPosts array', () => {
    expect(Array.isArray(contentPosts)).toBe(true);
  });

  it('builds content posts from raw modules', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-10T00:00:00Z'));
    const rawModules = {
      './hello.md': `---\ntitle: Hello\nslug: hello-world\nexcerpt: Short\nstatus: draft\ntags: Cats, Dogs\nicon: brain\ncoverImage: https://example.com/cover.jpg\nauthor: Author\npublishedAt: 2024-01-02\n---\nBody content`,
      './second.md': 'Second content without frontmatter',
      '/': `---\ntitle: No File Name\n---\nFallback`,
    };
    const posts = buildContentPosts(rawModules);
    expect(posts.length).toBe(3);
    const hello = posts.find((post) => post.id === 'hello-world');
    expect(hello?.status).toBe('draft');
    expect(hello?.tags).toEqual(['cats', 'dogs']);
    const second = posts.find((post) => post.id === 'second');
    expect(second?.status).toBe('published');
    expect(second?.excerpt).toContain('Second content');
    const fallback = posts.find((post) => post.title === 'No File Name');
    expect(fallback?.id).toBe('no-file-name');
    jest.useRealTimers();
  });

  it('uses import.meta glob when available', async () => {
    const globMock = jest.fn().mockReturnValue({
      './glob.md': 'Glob content',
    });
    (globalThis as { __CONTENT_GLOB__?: (pattern: string) => Record<string, string> }).__CONTENT_GLOB__ = globMock;
    jest.resetModules();
    const fresh = await import('../content/posts');
    expect(globMock).toHaveBeenCalled();
    expect(fresh.contentPosts.length).toBe(1);
    (globalThis as { __CONTENT_GLOB__?: (pattern: string) => Record<string, string> }).__CONTENT_GLOB__ = undefined;
  });
});
