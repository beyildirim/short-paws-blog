import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';

interface BookmarkState {
    bookmarkedPosts: string[];
    addBookmark: (postId: string) => void;
    removeBookmark: (postId: string) => void;
    toggleBookmark: (postId: string) => boolean;
    isBookmarked: (postId: string) => boolean;
    getBookmarkCount: () => number;
}

export const useBookmarkStore = create<BookmarkState>()(
    persist(
        (set, get) => ({
            bookmarkedPosts: [],

            addBookmark: (postId) => {
                set((state) => ({
                    bookmarkedPosts: state.bookmarkedPosts.includes(postId)
                        ? state.bookmarkedPosts
                        : [...state.bookmarkedPosts, postId],
                }));
            },

            removeBookmark: (postId) => {
                set((state) => ({
                    bookmarkedPosts: state.bookmarkedPosts.filter((id) => id !== postId),
                }));
            },

            toggleBookmark: (postId) => {
                const isCurrentlyBookmarked = get().bookmarkedPosts.includes(postId);
                if (isCurrentlyBookmarked) {
                    get().removeBookmark(postId);
                    return false;
                } else {
                    get().addBookmark(postId);
                    return true;
                }
            },

            isBookmarked: (postId) => get().bookmarkedPosts.includes(postId),

            getBookmarkCount: () => get().bookmarkedPosts.length,
        }),
        {
            name: STORAGE_KEYS.BOOKMARKS ?? 'short-paws-bookmarks',
            version: 1,
        }
    )
);
