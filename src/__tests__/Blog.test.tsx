import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import Blog from '../pages/Blog';
import { useBlogStore } from '../store/blogStore';

// Import the global type declarations
import '../types/global';

// Mock the blog store
jest.mock('../store/blogStore');

const mockPosts = [
  {
    id: 'test-post-1',
    title: 'Test Post 1',
    date: '2024-01-01',
    readTime: '5 min read',
    excerpt: 'This is a test post',
    content: 'Test content',
    icon: 'cat',
  },
];

describe('Blog Component', () => {

  beforeEach(() => {
    // Setup mock return values
    (useBlogStore as unknown as jest.Mock).mockImplementation(() => ({
      posts: mockPosts,
      addPost: jest.fn(),
      editPost: jest.fn(),
      deletePost: jest.fn(),
    }));
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
    (useBlogStore as unknown as jest.Mock).mockImplementation(() => ({
      posts: [],
      addPost: jest.fn(),
      editPost: jest.fn(),
      deletePost: jest.fn(),
    }));

    render(
      <Router>
        <Blog />
      </Router>
    );

    expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
  });
});
