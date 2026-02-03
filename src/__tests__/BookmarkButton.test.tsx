import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import { BookmarkButton } from '../components/BookmarkButton';
import { useBookmarkStore } from '../store/bookmarkStore';
import { act } from '@testing-library/react';

describe('BookmarkButton', () => {
    beforeEach(() => {
        // Clear bookmarks before each test
        act(() => {
            useBookmarkStore.setState({ bookmarkedPosts: [] });
        });
    });

    it('renders unbookmarked state by default', () => {
        render(<BookmarkButton postId="test-post" />);

        const button = screen.getByRole('button', { name: /add to reading list/i });
        expect(button).toBeInTheDocument();
    });

    it('toggles bookmark on click', () => {
        render(<BookmarkButton postId="test-post" />);

        const button = screen.getByRole('button');

        // Click to bookmark
        fireEvent.click(button);
        expect(useBookmarkStore.getState().isBookmarked('test-post')).toBe(true);

        // Click to unbookmark
        fireEvent.click(button);
        expect(useBookmarkStore.getState().isBookmarked('test-post')).toBe(false);
    });

    it('shows label when showLabel is true', () => {
        render(<BookmarkButton postId="test-post" showLabel />);

        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('shows Saved label when bookmarked with showLabel', () => {
        // Pre-bookmark the post
        act(() => {
            useBookmarkStore.getState().addBookmark('test-post');
        });

        render(<BookmarkButton postId="test-post" showLabel />);

        expect(screen.getByText('Saved')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<BookmarkButton postId="test-post" className="custom-class" />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('stops event propagation on click', () => {
        const parentClickHandler = jest.fn();

        render(
            <div onClick={parentClickHandler}>
                <BookmarkButton postId="test-post" />
            </div>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(parentClickHandler).not.toHaveBeenCalled();
    });
});
