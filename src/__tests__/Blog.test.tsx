import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import Blog from '../pages/Blog';
import { useBlogStore, type BlogPost } from '../store/blogStore';

const mockPosts: BlogPost[] = [
  {
    id: 'test-post-1',
    title: 'Test Post 1',
    excerpt: 'This is a test post',
    readTime: '5 min read',
    content: 'Test content',
    publishedAt: '2024-01-01T00:00:00.000Z',
    status: 'published',
    tags: ['test'],
    icon: 'cat',
    source: 'local',
  },
];

describe('Blog Component', () => {

  beforeEach(() => {
    useBlogStore.setState({ posts: mockPosts });
  });

  it('renders blog posts', () => {
    render(
      <Router>
        <Blog />
      </Router>
    );

    expect(screen.getByText('Gizmeli Kedi\'s Blog')).toBeInTheDocument();
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
  });

  it('navigates to blog post on read more click', () => {
    render(
      <Router>
        <Blog />
      </Router>
    );

    const readMoreLink = screen.getByRole('link', { name: /read more/i });
    expect(readMoreLink).toHaveAttribute('href', '/blog/test-post-1');
  });

  it('displays empty state when no posts', () => {
    // Override the mock to return no posts
    useBlogStore.setState({ posts: [] });

    render(
      <Router>
        <Blog />
      </Router>
    );

    expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
  });
});
