import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Boxes, Cat, Brain, HeartHandshake, type LucideIcon } from 'lucide-react';
import { STORAGE_KEYS } from '../constants';
import { estimateReadTime, generateId, slugify } from '../utils/helpers';
import type { Post, PostStatus } from '../types/post';

export type IconName = 'boxes' | 'cat' | 'brain' | 'heartHandshake';
export const iconMap: Record<IconName, LucideIcon> = {
  boxes: Boxes,
  cat: Cat,
  brain: Brain,
  heartHandshake: HeartHandshake,
};

export interface BlogPost extends Post {
  icon: IconName;
}

interface BlogState {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id' | 'source'>) => void;
  editPost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
}

const initialPosts: BlogPost[] = [];

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      posts: initialPosts,
      addPost: (post) => set((state) => ({
        posts: [
          {
            ...post,
            id: slugify(post.title) || generateId('post'),
            publishedAt: post.publishedAt || new Date().toISOString(),
            status: (post.status || 'published') as PostStatus,
            tags: post.tags || [],
            readTime: post.readTime || estimateReadTime(post.content),
            source: 'local',
          },
          ...state.posts,
        ],
      })),
      editPost: (id, updatedPost) => set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id
            ? {
                ...post,
                ...updatedPost,
                updatedAt: new Date().toISOString(),
                readTime: updatedPost.content ? estimateReadTime(updatedPost.content) : post.readTime,
              }
            : post
        ),
      })),
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter((post) => post.id !== id),
      })),
    }),
    {
      name: STORAGE_KEYS.BLOG,
      version: 1,
      migrate: (state: unknown) => {
        if (!state || typeof state !== 'object') return state;
        const typedState = state as { posts?: BlogPost[] } & Record<string, unknown>;
        if (!Array.isArray(typedState.posts)) return state;
        const migrated = typedState.posts.map((post) => ({
          ...post,
          tags: post.tags || [],
          status: post.status || 'published',
          publishedAt: post.publishedAt || new Date().toISOString(),
          source: post.source || 'local',
          readTime: post.readTime || estimateReadTime(post.content || ''),
        }));
        return { ...typedState, posts: migrated };
      },
    }
  )
);
