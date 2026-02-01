import React from 'react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Blog from '../pages/Blog';
import BlogPost from '../pages/BlogPost';
import NotFound from '../pages/NotFound';
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import { useSettingsStore } from '../store/settingsStore';
import { useBlogStore, type BlogPost as StoreBlogPost } from '../store/blogStore';
import { useCommentStore } from '../store/commentStore';
import { useNewsletterStore } from '../store/newsletterStore';
import { useAuthStore } from '../store/authStore';
import { formRateLimiter } from '../utils/crypto';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const baseSettings = clone(useSettingsStore.getState().settings);
baseSettings.adminPassword = '';
const baseSettingsActions = {
  updateSettings: useSettingsStore.getState().updateSettings,
  updateTheme: useSettingsStore.getState().updateTheme,
  updatePageContent: useSettingsStore.getState().updatePageContent,
};
const baseAuthActions = {
  login: useAuthStore.getState().login,
  logout: useAuthStore.getState().logout,
};

const samplePost = (overrides: Partial<StoreBlogPost> = {}): StoreBlogPost => ({
  id: 'post-1',
  title: 'Test Post',
  excerpt: 'Test excerpt',
  content: 'Test content',
  publishedAt: '2024-01-01T00:00:00.000Z',
  status: 'published',
  tags: ['cats', 'planning'],
  icon: 'cat',
  source: 'local',
  readTime: '1 min read',
  ...overrides,
});

describe('pages', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage?.clear();
      window.sessionStorage?.clear?.();
    }
    useSettingsStore.setState({
      settings: clone(baseSettings),
      ...baseSettingsActions,
    } as never);
    useBlogStore.setState({ posts: [] });
    useCommentStore.setState({ comments: [] });
    useNewsletterStore.setState({ subscribers: [] });
    useAuthStore.setState({
      ...baseAuthActions,
      isAuthenticated: false,
    } as never);
  });

  it('renders Home and About', () => {
    render(<Home />);
    expect(screen.getByText("Gizmeli Kedi")).toBeInTheDocument();
    render(<About />);
    expect(screen.getByText('Professional Journey')).toBeInTheDocument();
  });

  it('renders Contact and validates form', () => {
    jest.useFakeTimers();
    render(<Contact />);
    const form = document.querySelector('form') as HTMLFormElement | null;
    if (!form) throw new Error('form not found');

    fireEvent.submit(form);
    expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Name' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Message *'), { target: { value: 'Hello there this is a message' } });
    fireEvent.submit(form);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText(/Message sent/)).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('shows contact rate limit error', () => {
    // Exhaust rate limiter
    for (let i = 0; i < 5; i += 1) {
      formRateLimiter.canAttempt('contact-form');
    }
    render(<Contact />);
    const form = document.querySelector('form');
    if (!form) throw new Error('form not found');
    fireEvent.submit(form);
    expect(screen.getByText('Please wait before sending another message.')).toBeInTheDocument();
    formRateLimiter.reset('contact-form');
  });

  it('renders Blog and filters posts', async () => {
    useBlogStore.setState({
      posts: [
        samplePost({ id: 'post-1', title: 'Cat Tips', tags: ['cats'], coverImage: 'https://example.com/cover.jpg' }),
        samplePost({ id: 'post-2', title: 'Dog Tips', tags: ['dogs'] }),
      ],
    });
    const subscribeMock = jest.fn().mockResolvedValue({ success: true, message: 'ok' });
    useNewsletterStore.setState({ subscribe: subscribeMock } as never);

    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    );
    expect(screen.getByAltText('Cat Tips')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search blog posts'), { target: { value: 'cat' } });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.getByText('Cat Tips')).toBeInTheDocument();
    expect(screen.queryByText('Dog Tips')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '#cats' }));
    expect(screen.getByText('Cat Tips')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search blog posts'), { target: { value: 'nope' } });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.getByText('No posts found 😿')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Email address for newsletter'), { target: { value: 'user@example.com' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Subscribe' }).closest('form') as HTMLFormElement);
    await act(async () => {});
    expect(subscribeMock).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('shows newsletter error state', async () => {
    useBlogStore.setState({
      posts: [samplePost({ id: 'post-1', title: 'Cat Tips', tags: ['cats'] })],
    });
    const subscribeMock = jest.fn().mockResolvedValue({ success: false, message: 'Nope' });
    useNewsletterStore.setState({ subscribe: subscribeMock } as never);

    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email address for newsletter'), { target: { value: 'user@example.com' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Subscribe' }).closest('form') as HTMLFormElement);
    await act(async () => {});
    const status = screen.getByText('Nope');
    expect(status).toHaveClass('bg-red-100');
  });

  it('renders BlogPost not found', () => {
    render(
      <MemoryRouter initialEntries={['/blog/missing']}>
        <Routes>
          <Route path="/blog/:postId" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Post not found')).toBeInTheDocument();
  });

  it('renders BlogPost with content and comments', () => {
    jest.useFakeTimers();
    useSettingsStore.setState({
      settings: {
        ...clone(baseSettings),
        seo: { ...baseSettings.seo, siteUrl: 'https://example.com' },
      },
    });
    useBlogStore.setState({
      posts: [
        samplePost({ id: 'post-1', tags: ['cats'], publishedAt: '2024-01-02T00:00:00.000Z' }),
        samplePost({ id: 'post-2', title: 'Second', tags: ['cats'], publishedAt: '2024-01-03T00:00:00.000Z' }),
        samplePost({ id: 'post-3', title: 'Third', tags: ['dogs'], publishedAt: '2024-01-01T00:00:00.000Z' }),
      ],
    });
    useCommentStore.setState({
      comments: [
        {
          id: 'comment-1',
          postId: 'post-1',
          author: 'Alice',
          content: 'Nice post',
          createdAt: new Date().toISOString(),
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/blog/post-1']}>
        <Routes>
          <Route path="/blog/:postId" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Comments (1)')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Related Posts')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'bob@example.com' } });
    fireEvent.change(screen.getByLabelText('Comment *'), { target: { value: 'This is a great post!' } });
    fireEvent.submit(screen.getByText('Post Comment').closest('form') as HTMLFormElement);
    expect(screen.getByText(/Comment posted successfully/)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    jest.useRealTimers();
  });

  it('renders BlogPost with single post and cover image', () => {
    useSettingsStore.setState({
      settings: {
        ...clone(baseSettings),
        seo: { ...baseSettings.seo, siteUrl: 'https://example.com', twitterHandle: '@cat' },
      },
    });
    useBlogStore.setState({
      posts: [
        samplePost({
          id: 'solo-post',
          title: 'Solo',
          tags: [],
          coverImage: 'https://example.com/cover.jpg',
          author: 'Author',
        }),
      ],
    });

    render(
      <MemoryRouter initialEntries={['/blog/solo-post']}>
        <Routes>
          <Route path="/blog/:postId" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Solo')).toBeInTheDocument();
    expect(screen.queryByText('Related Posts')).not.toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
  });

  it('renders BlogPost with fallback metadata and comment errors', async () => {
    useSettingsStore.setState({
      settings: {
        ...clone(baseSettings),
        seo: { ...baseSettings.seo, siteUrl: 'https://example.com', defaultOgImage: 'https://example.com/og.jpg' },
        author: { ...baseSettings.author, name: '', role: '', bio: '', avatar: '' },
        content: {
          ...baseSettings.content,
          home: {
            ...baseSettings.content.home,
            profileImage: 'https://example.com/home.jpg',
            jobTitle: 'Fallback Role',
            bio: 'Fallback Bio',
          },
        },
      },
    });
    useBlogStore.setState({
      posts: [samplePost({ id: 'fallback-meta', author: undefined, coverImage: undefined })],
    });

    render(
      <MemoryRouter initialEntries={['/blog/fallback-meta']}>
        <Routes>
          <Route path="/blog/:postId" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Gizmeli Kedi')).toBeInTheDocument();
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://example.com/og.jpg');

    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'bad' } });
    fireEvent.change(screen.getByLabelText('Comment *'), { target: { value: 'This is a great post!' } });
    fireEvent.submit(screen.getByText('Post Comment').closest('form') as HTMLFormElement);
    await act(async () => {});
    const status = screen.getByText('Please enter a valid email address');
    expect(status).toHaveClass('bg-red-100');
  });

  it('omits og image metadata when unavailable', () => {
    useSettingsStore.setState({
      settings: {
        ...clone(baseSettings),
        seo: { ...baseSettings.seo, siteUrl: 'https://example.com', defaultOgImage: '' },
        author: { ...baseSettings.author, avatar: '' },
        content: {
          ...baseSettings.content,
          home: { ...baseSettings.content.home, profileImage: '' },
        },
      },
    });
    useBlogStore.setState({
      posts: [samplePost({ id: 'no-image', coverImage: undefined })],
    });

    render(
      <MemoryRouter initialEntries={['/blog/no-image']}>
        <Routes>
          <Route path="/blog/:postId" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );

    expect(document.querySelector('meta[property="og:image"]')).toBeNull();
    expect(document.querySelector('meta[name="twitter:image"]')).toBeNull();
    expect(screen.getByText('No comments yet. Be the first to share your thoughts! 🐱')).toBeInTheDocument();
  });

  it('uses current url when siteUrl is missing', () => {
    useSettingsStore.setState({
      settings: {
        ...clone(baseSettings),
        seo: { ...baseSettings.seo, siteUrl: '' },
      },
    });
    useBlogStore.setState({
      posts: [samplePost({ id: 'fallback-post', publishedAt: '2024-01-02T00:00:00.000Z' })],
    });
    const currentUrl = window.location.href;
    render(
      <MemoryRouter initialEntries={['/blog/fallback-post']}>
        <Routes>
          <Route path="/blog/:postId" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe(currentUrl);
  });

  it('renders NotFound', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('handles Login setup validation', async () => {
    useSettingsStore.setState({ settings: { ...clone(baseSettings), adminPassword: '' } });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Set Password' }));
    expect(screen.getByText('Please enter and confirm a new password')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'Password123' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Set Password' }).closest('form') as HTMLFormElement);
    });
  });

  it('shows setup login failure fallback message', async () => {
    useSettingsStore.setState({ settings: { ...clone(baseSettings), adminPassword: '' } });
    const loginMock = jest.fn().mockResolvedValue({ success: false });
    act(() => {
      useAuthStore.setState({ login: loginMock } as never);
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'Password123' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Set Password' }).closest('form') as HTMLFormElement);
    });
    expect(await screen.findByText('Unable to log in after setup')).toBeInTheDocument();
  });

  it('shows setup errors for mismatched and weak passwords', async () => {
    useSettingsStore.setState({ settings: { ...clone(baseSettings), adminPassword: '' } });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'Different' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Set Password' }).closest('form') as HTMLFormElement);
    });
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), { target: { value: 'short' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'short' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Set Password' }).closest('form') as HTMLFormElement);
    });
    expect(screen.getByText('Password must be at least 10 characters long.')).toBeInTheDocument();
  });

  it('handles Login with existing password', async () => {
    useSettingsStore.setState({ settings: { ...clone(baseSettings), adminPassword: 'hashed' } });
    const loginMock = jest.fn().mockResolvedValue({ success: false, error: 'Invalid username or password' });
    act(() => {
      useAuthStore.setState({ login: loginMock } as never);
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'bad' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }).closest('form') as HTMLFormElement);
    });
    expect(loginMock).toHaveBeenCalled();
  });

  it('handles Login with missing credentials', async () => {
    useSettingsStore.setState({ settings: { ...clone(baseSettings), adminPassword: 'hashed' } });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: '' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }).closest('form') as HTMLFormElement);
    });
    expect(screen.getByText('Please enter both username and password')).toBeInTheDocument();
  });

  it('shows login fallback error when message missing', async () => {
    useSettingsStore.setState({ settings: { ...clone(baseSettings), adminPassword: 'hashed' } });
    const loginMock = jest.fn().mockResolvedValue({ success: false });
    act(() => {
      useAuthStore.setState({ login: loginMock } as never);
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'Password123' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }).closest('form') as HTMLFormElement);
    });
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });

  it('navigates on Login success and handles errors', async () => {
    useSettingsStore.setState({ settings: { ...clone(baseSettings), adminPassword: 'hashed' } });
    const loginSuccess = jest.fn().mockResolvedValue({ success: true });
    act(() => {
      useAuthStore.setState({ login: loginSuccess } as never);
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'Password123' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }).closest('form') as HTMLFormElement);
    });
    expect(loginSuccess).toHaveBeenCalled();

    const loginFail = jest.fn().mockRejectedValue(new Error('boom'));
    act(() => {
      useAuthStore.setState({ login: loginFail } as never);
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'Password123' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }).closest('form') as HTMLFormElement);
    });
    expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    errorSpy.mockRestore();
  });

  it('renders Dashboard and triggers actions', async () => {
    const addPost = jest.fn();
    const editPost = jest.fn();
    const deletePost = jest.fn();
    const updateTheme = jest.fn();
    const updatePageContent = jest.fn();
    const updateSettings = jest.fn();
    const logout = jest.fn();

    const brokenPost = {
      ...samplePost({ id: 'post-2', title: 'No Tags' }),
      tags: undefined as unknown as string[],
      publishedAt: '',
      coverImage: undefined,
    } as StoreBlogPost;

    useAuthStore.setState({ logout } as never);
    useBlogStore.setState({
      posts: [samplePost({ id: 'post-1', title: 'Dash Post', coverImage: 'https://example.com/cover.jpg' }), brokenPost],
      addPost,
      editPost,
      deletePost,
    } as never);
    useSettingsStore.setState({
      settings: clone(baseSettings),
      updateTheme,
      updatePageContent,
      updateSettings,
    } as never);

    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    Object.defineProperty(window, 'alert', { value: jest.fn(), configurable: true });
    Object.defineProperty(window, 'confirm', { value: jest.fn(() => true), configurable: true });
    const alertSpy = window.alert as jest.Mock;

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(logout).toHaveBeenCalled();

    // Add new post
    fireEvent.click(screen.getByText('Add New Post'));
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByPlaceholderText('Tags (comma-separated)'), { target: { value: 'Cats, Dogs' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'draft' } });
    const addDate = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(addDate, { target: { value: '2024-01-02' } });
    fireEvent.change(screen.getByPlaceholderText('Cover image URL (optional)'), { target: { value: 'https://example.com/cover.jpg' } });
    fireEvent.change(screen.getByPlaceholderText('Excerpt'), { target: { value: 'Excerpt' } });
    fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'Content' } });
    fireEvent.click(screen.getByText('Save'));
    expect(addPost).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Add New Post'));
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'No Date' } });
    fireEvent.change(screen.getByPlaceholderText('Excerpt'), { target: { value: 'Excerpt' } });
    fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'Content' } });
    fireEvent.click(screen.getByText('Save'));
    expect(addPost).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Add New Post'));
    fireEvent.click(screen.getByText('Cancel'));

    // Edit existing post with full data
    fireEvent.click(screen.getAllByLabelText('Edit post')[0]);
    fireEvent.click(screen.getByText('Cancel'));

    // Edit existing post with missing fields
    fireEvent.click(screen.getAllByLabelText('Edit post')[1]);
    fireEvent.click(screen.getByText('Cancel'));
    fireEvent.click(screen.getAllByLabelText('Edit post')[1]);
    fireEvent.change(screen.getByDisplayValue('No Tags'), { target: { value: 'Edited' } });
    fireEvent.change(screen.getByPlaceholderText('Tags (comma-separated)'), { target: { value: 'updated, tags' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'scheduled' } });
    const editDate = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(editDate, { target: { value: '2024-02-02' } });
    fireEvent.change(screen.getByPlaceholderText('Cover image URL (optional)'), { target: { value: 'https://example.com/cover2.jpg' } });
    fireEvent.change(screen.getByDisplayValue('Test excerpt'), { target: { value: 'Edited excerpt' } });
    fireEvent.change(screen.getByDisplayValue('Test content'), { target: { value: 'Edited content' } });
    fireEvent.click(screen.getByText('Save'));
    expect(editPost).toHaveBeenCalled();

    // Delete
    fireEvent.click(screen.getAllByLabelText('Delete post')[0]);
    expect(deletePost).toHaveBeenCalled();

    // Theme tab
    fireEvent.click(screen.getByText('Theme'));
    fireEvent.change(screen.getByDisplayValue('#9333ea'), { target: { value: '#000000' } });
    fireEvent.change(screen.getByDisplayValue('#ec4899'), { target: { value: '#111111' } });
    fireEvent.change(screen.getByDisplayValue('#fde047'), { target: { value: '#222222' } });
    fireEvent.change(screen.getByDisplayValue('Comic'), { target: { value: 'serif' } });
    const borderSelect = screen.getByText('Border Style').parentElement?.querySelector('select') as HTMLSelectElement;
    fireEvent.change(borderSelect, { target: { value: 'border-2' } });
    fireEvent.click(screen.getByText('Save Theme'));
    expect(updateTheme).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Blog Posts'));

    // Pages tab
    fireEvent.click(screen.getByText('Pages'));
    fireEvent.change(screen.getByDisplayValue("Welcome to Gizmeli Kedi's Personal Website!"), { target: { value: 'Welcome!' } });
    fireEvent.change(
      screen.getByDisplayValue('https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop'),
      { target: { value: 'https://example.com/new.jpg' } }
    );
    fireEvent.change(screen.getByDisplayValue('Planning Specialist'), { target: { value: 'Planner' } });
    fireEvent.change(screen.getByDisplayValue('Turning chaos into order, one plan at a time'), { target: { value: 'New bio' } });
    fireEvent.click(screen.getByText('Save Home Page'));
    const journeyField = screen.getByText('Professional Journey').parentElement?.querySelector('textarea') as HTMLTextAreaElement;
    fireEvent.change(screen.getByDisplayValue('Professional Journey'), { target: { value: 'Journey' } });
    fireEvent.change(journeyField, { target: { value: 'Updated journey' } });
    const skillsField = screen.getByText('Skills (one per line)').parentElement?.querySelector('textarea') as HTMLTextAreaElement;
    fireEvent.change(skillsField, { target: { value: 'Skill1\nSkill2' } });
    const philosophyField = screen.getByText('Work Philosophy').parentElement?.querySelector('textarea') as HTMLTextAreaElement;
    fireEvent.change(philosophyField, { target: { value: 'New philosophy' } });
    fireEvent.click(screen.getByText('Save About Page'));

    fireEvent.change(screen.getByDisplayValue('gizmelikedi@example.com'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByDisplayValue('+1 (555) 123-4567'), { target: { value: '+1 (555) 987-6543' } });
    fireEvent.change(screen.getByDisplayValue('Planning Department, Dream Corp'), { target: { value: 'New address' } });
    const officeHoursField = screen.getByText('Office Hours').parentElement?.querySelector('textarea') as HTMLTextAreaElement;
    fireEvent.change(officeHoursField, { target: { value: 'Always' } });
    fireEvent.click(screen.getByText('Save Contact Page'));
    expect(updatePageContent).toHaveBeenCalled();

    // Settings tab
    fireEvent.click(screen.getByText('Settings'));
    fireEvent.change(screen.getByDisplayValue("Gizmeli Kedi's Personal Website"), { target: { value: 'New Title' } });
    fireEvent.change(
      screen.getByDisplayValue('Planning Specialist turning chaos into order, one plan at a time'),
      { target: { value: 'New description' } }
    );
    fireEvent.change(screen.getByPlaceholderText('https://yourdomain.com'), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByPlaceholderText('https://...'), { target: { value: 'https://example.com/og.jpg' } });
    fireEvent.change(screen.getByPlaceholderText('@yourhandle'), { target: { value: '@handle' } });
    fireEvent.change(screen.getByPlaceholderText('Twitter URL'), { target: { value: 'https://twitter.com/user' } });
    fireEvent.change(screen.getByPlaceholderText('LinkedIn URL'), { target: { value: 'https://linkedin.com/in/user' } });
    fireEvent.change(screen.getByPlaceholderText('GitHub URL'), { target: { value: 'https://github.com/user' } });
    fireEvent.change(screen.getByPlaceholderText('Author name'), { target: { value: 'Author' } });
    fireEvent.change(screen.getByPlaceholderText('Role / Title'), { target: { value: 'Role' } });
    fireEvent.change(screen.getByPlaceholderText('Short bio'), { target: { value: 'Bio' } });
    fireEvent.change(screen.getByPlaceholderText('Avatar image URL'), { target: { value: 'https://example.com/avatar.jpg' } });
    fireEvent.change(screen.getByPlaceholderText('Enter new password'), { target: { value: 'short' } });
    await act(async () => {
      fireEvent.click(screen.getByText('Save Settings'));
    });
    expect(alertSpy).toHaveBeenCalled();
    fireEvent.change(screen.getByPlaceholderText('Enter new password'), { target: { value: 'Password1234' } });
    await act(async () => {
      fireEvent.click(screen.getByText('Save Settings'));
      await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(updateSettings).toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(screen.getByText('Save Settings'));
    });

    Object.defineProperty(window, 'alert', { value: originalAlert, configurable: true });
    Object.defineProperty(window, 'confirm', { value: originalConfirm, configurable: true });
  });
});
