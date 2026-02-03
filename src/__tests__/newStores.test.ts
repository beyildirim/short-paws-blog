import { renderHook, act } from '@testing-library/react';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useViewsStore } from '../store/viewsStore';

describe('bookmarkStore', () => {
    beforeEach(() => {
        const { result } = renderHook(() => useBookmarkStore());
        // Clear all bookmarks
        act(() => {
            result.current.bookmarkedPosts.forEach((id) => {
                result.current.removeBookmark(id);
            });
        });
    });

    it('adds a bookmark', () => {
        const { result } = renderHook(() => useBookmarkStore());

        act(() => {
            result.current.addBookmark('post-1');
        });

        expect(result.current.isBookmarked('post-1')).toBe(true);
        expect(result.current.getBookmarkCount()).toBe(1);
    });

    it('removes a bookmark', () => {
        const { result } = renderHook(() => useBookmarkStore());

        act(() => {
            result.current.addBookmark('post-1');
        });
        expect(result.current.isBookmarked('post-1')).toBe(true);

        act(() => {
            result.current.removeBookmark('post-1');
        });
        expect(result.current.isBookmarked('post-1')).toBe(false);
    });

    it('toggles a bookmark', () => {
        const { result } = renderHook(() => useBookmarkStore());

        let wasAdded: boolean;
        act(() => {
            wasAdded = result.current.toggleBookmark('post-2');
        });
        expect(wasAdded!).toBe(true);
        expect(result.current.isBookmarked('post-2')).toBe(true);

        act(() => {
            wasAdded = result.current.toggleBookmark('post-2');
        });
        expect(wasAdded!).toBe(false);
        expect(result.current.isBookmarked('post-2')).toBe(false);
    });

    it('does not add duplicate bookmarks', () => {
        const { result } = renderHook(() => useBookmarkStore());

        act(() => {
            result.current.addBookmark('post-3');
            result.current.addBookmark('post-3');
        });

        expect(result.current.getBookmarkCount()).toBe(1);
    });
});

describe('viewsStore', () => {
    beforeEach(() => {
        // Reset the store state
        act(() => {
            useViewsStore.setState({ views: {}, viewedInSession: new Set() });
        });
    });

    it('records a view', () => {
        const { result } = renderHook(() => useViewsStore());

        act(() => {
            result.current.recordView('post-1');
        });

        expect(result.current.getViewCount('post-1')).toBe(1);
    });

    it('does not double count views in same session', () => {
        const { result } = renderHook(() => useViewsStore());

        act(() => {
            result.current.recordView('post-1');
            result.current.recordView('post-1');
            result.current.recordView('post-1');
        });

        expect(result.current.getViewCount('post-1')).toBe(1);
    });

    it('counts views for different posts', () => {
        const { result } = renderHook(() => useViewsStore());

        act(() => {
            result.current.recordView('post-1');
            result.current.recordView('post-2');
        });

        expect(result.current.getViewCount('post-1')).toBe(1);
        expect(result.current.getViewCount('post-2')).toBe(1);
        expect(result.current.getTotalViews()).toBe(2);
    });

    it('returns 0 for unviewed posts', () => {
        const { result } = renderHook(() => useViewsStore());

        expect(result.current.getViewCount('nonexistent')).toBe(0);
    });
});
