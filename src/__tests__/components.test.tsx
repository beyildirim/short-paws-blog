import React from 'react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TagFilter } from '../components/TagFilter';
import { ReadingProgress } from '../components/ReadingProgress';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { SocialShare } from '../components/SocialShare';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { MobileNav } from '../components/MobileNav';
import { PageSkeleton } from '../components/PageSkeleton';
import { Analytics } from '../components/Analytics';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AuthorCard } from '../components/AuthorCard';
import { BlogSearch } from '../components/BlogSearch';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { MarkdownContent } from '../components/MarkdownContent';
import { useAuthStore } from '../store/authStore';

describe('components', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false });
    (globalThis as { __ENV__?: Record<string, string | boolean> }).__ENV__ = {};
  });

  it('TagFilter returns null when no tags', () => {
    const { container } = render(<TagFilter tags={[]} activeTag={null} onChange={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('TagFilter handles selection', () => {
    const onChange = jest.fn();
    render(<TagFilter tags={['cats']} activeTag="cats" onChange={onChange} />);
    fireEvent.click(screen.getByText('All'));
    fireEvent.click(screen.getByText('#cats'));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(onChange).toHaveBeenCalledWith('cats');
  });

  it('ReadingProgress renders width', () => {
    const { container } = render(<ReadingProgress progress={42} />);
    const bar = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(bar.style.width).toBe('42%');
  });

  it('ProtectedRoute redirects when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedRoute>
          <div>Secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('ProtectedRoute renders children when authenticated', () => {
    useAuthStore.setState({ isAuthenticated: true });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedRoute>
          <div>Secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Secret')).toBeInTheDocument();
  });

  it('SocialShare opens share links and copies', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    jest.useFakeTimers();

    render(<SocialShare title="Title" description="Desc" url="https://example.com" />);
    fireEvent.click(screen.getByLabelText('Share on Twitter'));
    fireEvent.click(screen.getByLabelText('Share on LinkedIn'));
    fireEvent.click(screen.getByLabelText('Share on Facebook'));
    expect(openSpy).toHaveBeenCalledTimes(3);

    fireEvent.click(screen.getByLabelText('Copy link'));
    await act(async () => {});
    expect(writeText).toHaveBeenCalled();
    expect(screen.getByText('Copied!')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();

    openSpy.mockRestore();
    jest.useRealTimers();
  });

  it('SocialShare handles copy failure', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const writeText = jest.fn().mockRejectedValue(new Error('fail'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    render(<SocialShare title="Title" url="https://example.com" />);
    fireEvent.click(screen.getByLabelText('Copy link'));
    await act(async () => {});
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    errorSpy.mockRestore();
  });

  it('SocialShare falls back to current url', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    window.history.pushState({}, '', '/current');
    render(<SocialShare title="Title" />);
    fireEvent.click(screen.getByLabelText('Share on Twitter'));
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(window.location.href)),
      '_blank',
      expect.any(String)
    );
    openSpy.mockRestore();
  });

  it('Breadcrumbs hides on home and handles long paths', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumbs />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();

    render(
      <MemoryRouter initialEntries={['/blog/12345']}>
        <Breadcrumbs />
      </MemoryRouter>
    );
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.queryByText('12345')).not.toBeInTheDocument();
  });

  it('ResponsiveImage applies default loading', () => {
    render(<ResponsiveImage src="/image.png" alt="Alt text" />);
    const img = screen.getByAltText('Alt text') as HTMLImageElement;
    expect(img.getAttribute('loading')).toBe('lazy');
  });

  it('MobileNav toggles and shows admin link', () => {
    (globalThis as { __ENV__?: Record<string, string | boolean> }).__ENV__ = {
      VITE_ENABLE_ADMIN: 'true',
    };
    render(
      <MemoryRouter initialEntries={['/about']}>
        <MobileNav />
      </MemoryRouter>
    );
    const button = screen.getByLabelText('Open menu');
    fireEvent.click(button);
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('MobileNav closes via overlay and highlights active link', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <MobileNav />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText('Open menu'));
    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink?.className).toContain('bg-purple-100');
    const overlay = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(overlay);
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('PageSkeleton renders skeleton blocks', () => {
    const { container } = render(<PageSkeleton />);
    expect(container.querySelectorAll('div').length).toBeGreaterThan(1);
  });

  it('Analytics renders when domain is set', () => {
    (globalThis as { __ENV__?: Record<string, string | boolean> }).__ENV__ = {
      VITE_PLAUSIBLE_DOMAIN: 'example.com',
      VITE_PLAUSIBLE_SRC: 'https://plausible.io/js/script.js',
    };
    const { container } = render(<Analytics />);
    expect(container.querySelector('script')).toBeTruthy();
  });

  it('Analytics returns null when domain is missing', () => {
    (globalThis as { __ENV__?: Record<string, string | boolean> }).__ENV__ = {};
    const { container } = render(<Analytics />);
    expect(container.firstChild).toBeNull();
  });

  it('Analytics uses default src when not provided', () => {
    (globalThis as { __ENV__?: Record<string, string | boolean> }).__ENV__ = {
      VITE_PLAUSIBLE_DOMAIN: 'example.com',
    };
    const { container } = render(<Analytics />);
    const script = container.querySelector('script');
    expect(script?.getAttribute('src')).toBe('https://plausible.io/js/script.js');
  });

  it('LoadingSpinner supports sizes and fullscreen', () => {
    const { rerender } = render(<LoadingSpinner size="small" message="Loading" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    rerender(<LoadingSpinner size="large" fullScreen />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('AuthorCard renders image or fallback', () => {
    const { rerender } = render(<AuthorCard name="Name" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    rerender(<AuthorCard name="Name" image="/img.png" role="Role" bio="Bio" email="a@b.com" />);
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Bio')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('BlogSearch debounces search and clears', () => {
    const onSearch = jest.fn();
    jest.useFakeTimers();
    render(<BlogSearch onSearch={onSearch} />);
    fireEvent.change(screen.getByLabelText('Search blog posts'), { target: { value: 'cats' } });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onSearch).toHaveBeenCalledWith('cats');
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(onSearch).toHaveBeenCalledWith('');
    jest.useRealTimers();
  });

  it('BlogSearch toggles focus styles', () => {
    render(<BlogSearch onSearch={jest.fn()} />);
    const input = screen.getByLabelText('Search blog posts');
    fireEvent.focus(input);
    expect(input.parentElement?.className).toContain('border-purple-500');
    fireEvent.blur(input);
    expect(input.parentElement?.className).toContain('border-purple-300');
  });

  it('ErrorBoundary renders fallback on error and resets', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const originalAssign = window.location.assign;
    let assignSpy: jest.Mock | null = null;
    try {
      assignSpy = jest.fn();
      Object.defineProperty(window.location, 'assign', {
        value: assignSpy,
        configurable: true,
        writable: true,
      });
    } catch {
      assignSpy = null;
    }
    const Problem = () => {
      throw new Error('Boom');
    };
    render(
      <ErrorBoundary>
        <Problem />
      </ErrorBoundary>
    );
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Try Again'));
    fireEvent.click(screen.getByText('Go Home'));
    if (assignSpy) {
      expect(assignSpy).toHaveBeenCalledWith('/');
      Object.defineProperty(window.location, 'assign', { value: originalAssign, configurable: true });
    }
    errorSpy.mockRestore();
  });

  it('MarkdownContent renders HTML output', () => {
    const { container } = render(<MarkdownContent content="**bold**" />);
    expect(container.querySelector('div')?.innerHTML).toContain('<strong>');
  });
});
