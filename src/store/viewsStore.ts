import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';

interface ViewsState {
    views: Record<string, number>;
    viewedInSession: Set<string>;
    recordView: (postId: string) => void;
    getViewCount: (postId: string) => number;
    getTotalViews: () => number;
}

export const useViewsStore = create<ViewsState>()(
    persist(
        (set, get) => ({
            views: {},
            viewedInSession: new Set<string>(),

            recordView: (postId) => {
                // Only count once per session to avoid inflated counts
                const sessionViews = get().viewedInSession;
                if (sessionViews.has(postId)) {
                    return;
                }

                set((state) => {
                    const newSessionViews = new Set(state.viewedInSession);
                    newSessionViews.add(postId);
                    return {
                        views: {
                            ...state.views,
                            [postId]: (state.views[postId] || 0) + 1,
                        },
                        viewedInSession: newSessionViews,
                    };
                });
            },

            getViewCount: (postId) => get().views[postId] || 0,

            getTotalViews: () =>
                Object.values(get().views).reduce((sum, count) => sum + count, 0),
        }),
        {
            name: STORAGE_KEYS.VIEWS,
            version: 1,
            partialize: (state) => ({ views: state.views }), // Don't persist session views
        }
    )
);
