import React, { useRef } from 'react';
import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import { render, screen, act } from '@testing-library/react';
import { useBlogStore } from '../store/blogStore';
import type { Post } from '../types/post';

const contentPosts: Post[] = [
  {
    id: 'content-1',
    title: 'Content Post',
    excerpt: 'Content excerpt',
    content: 'Content body',
    publishedAt: '2024-01-05T00:00:00.000Z',
    status: 'published',
    tags: ['cats'],
    icon: 'cat',
    source: 'content',
  },
  {
    id: 'content-draft',
    title: 'Draft Post',
    excerpt: 'Draft excerpt',
    content: 'Draft body',
    publishedAt: '2024-01-06T00:00:00.000Z',
    status: 'draft',
    tags: [],
    icon: 'cat',
    source: 'content',
  },
];

const isPostVisible = jest.fn((post: Post) => post.status !== 'draft');

jest.unstable_mockModule('../content/posts', () => ({
  contentPosts,
  isPostVisible,
}));

let usePosts: typeof import('../hooks/usePosts').usePosts;
let getAdjacentPosts: typeof import('../hooks/usePosts').getAdjacentPosts;
let getRelatedPosts: typeof import('../hooks/usePosts').getRelatedPosts;
let useReadingProgress: typeof import('../hooks/useReadingProgress').useReadingProgress;

beforeAll(async () => {
  ({ usePosts, getAdjacentPosts, getRelatedPosts } = await import('../hooks/usePosts'));
  ({ useReadingProgress } = await import('../hooks/useReadingProgress'));
});

describe('usePosts', () => {
  it('merges local and content posts and filters drafts by default', () => {
    useBlogStore.setState({
      posts: [
        {
          id: 'local-1',
          title: 'Local Post',
          excerpt: 'Local excerpt',
          content: 'Local body',
          publishedAt: '2024-01-04T00:00:00.000Z',
          status: 'published',
          tags: ['cats'],
          icon: 'cat',
          source: 'local',
        },
      ],
    });

    function PostsList() {
      const posts = usePosts();
      return (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      );
    }

    render(<PostsList />);
    expect(screen.getByText('Local Post')).toBeInTheDocument();
    expect(screen.getByText('Content Post')).toBeInTheDocument();
    expect(screen.queryByText('Draft Post')).not.toBeInTheDocument();
  });

  it('includes drafts when requested', () => {
    function PostsList() {
      const posts = usePosts({ includeDrafts: true });
      return (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      );
    }

    render(<PostsList />);
    expect(screen.getByText('Draft Post')).toBeInTheDocument();
  });
});

describe('post helpers', () => {
  it('finds adjacent posts', () => {
    const posts: Post[] = [
      { ...contentPosts[0], id: 'a', publishedAt: '2024-01-03T00:00:00.000Z' },
      { ...contentPosts[0], id: 'b', publishedAt: '2024-01-02T00:00:00.000Z' },
      { ...contentPosts[0], id: 'c', publishedAt: '2024-01-01T00:00:00.000Z' },
    ];
    const { previous, next } = getAdjacentPosts(posts, 'b');
    expect(previous?.id).toBe('c');
    expect(next?.id).toBe('a');
    const none = getAdjacentPosts(posts, 'missing');
    expect(none.previous).toBeNull();
    expect(none.next).toBeNull();
  });

  it('finds related posts', () => {
    const posts: Post[] = [
      { ...contentPosts[0], id: 'a', tags: ['cats', 'tips'], publishedAt: '2024-01-03T00:00:00.000Z' },
      { ...contentPosts[0], id: 'b', tags: ['cats'], publishedAt: '2024-01-02T00:00:00.000Z' },
      { ...contentPosts[0], id: 'c', tags: ['dogs'], publishedAt: '2024-01-01T00:00:00.000Z' },
    ];
    const related = getRelatedPosts(posts, posts[0], 2);
    expect(related.some((post) => post.id === 'b')).toBe(true);
    const noTags = getRelatedPosts(posts, { ...posts[0], tags: [] }, 2);
    expect(noTags.length).toBe(2);
  });

  it('breaks ties by publish date for related posts', () => {
    const current = { ...contentPosts[0], id: 'current', tags: ['cats'] };
    const posts: Post[] = [
      current,
      { ...contentPosts[0], id: 'newer', tags: ['cats'], publishedAt: '2024-02-01T00:00:00.000Z' },
      { ...contentPosts[0], id: 'older', tags: ['cats'], publishedAt: '2024-01-01T00:00:00.000Z' },
    ];
    const related = getRelatedPosts(posts, current, 2);
    expect(related[0].id).toBe('newer');
    expect(related[1].id).toBe('older');
  });
});

describe('useReadingProgress', () => {
  it('returns 0 when target is missing', () => {
    function Reader() {
      const ref = useRef<HTMLDivElement>(null);
      const progress = useReadingProgress(ref);
      return <span data-testid="progress">{progress.toFixed(0)}</span>;
    }

    render(<Reader />);
    expect(screen.getByTestId('progress').textContent).toBe('0');
  });

  it('tracks progress based on scroll', () => {
    function Reader() {
      const ref = useRef<HTMLDivElement>(null);
      const progress = useReadingProgress(ref);
      return (
        <div>
          <div ref={ref} data-testid="target" />
          <span data-testid="progress">{progress.toFixed(0)}</span>
        </div>
      );
    }

    Object.defineProperty(window, 'innerHeight', { value: 100, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

    render(<Reader />);
    const target = screen.getByTestId('target');
    Object.defineProperty(target, 'offsetTop', { value: 0 });
    Object.defineProperty(target, 'offsetHeight', { value: 500 });

    act(() => {
      window.scrollY = 50;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(Number(screen.getByTestId('progress').textContent)).toBeGreaterThan(0);
  });

  it('handles short content', () => {
    function Reader() {
      const ref = useRef<HTMLDivElement>(null);
      const progress = useReadingProgress(ref);
      return (
        <div>
          <div ref={ref} data-testid="target" />
          <span data-testid="progress">{progress.toFixed(0)}</span>
        </div>
      );
    }

    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

    render(<Reader />);
    const target = screen.getByTestId('target');
    Object.defineProperty(target, 'offsetTop', { value: 0 });
    Object.defineProperty(target, 'offsetHeight', { value: 500 });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTestId('progress').textContent).toBe('100');
  });
});
