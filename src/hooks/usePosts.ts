import { useMemo } from 'react';
import { contentPosts, isPostVisible } from '../content/posts';
import { useBlogStore } from '../store/blogStore';
import type { Post } from '../types/post';

const mergePosts = (localPosts: Post[], filterVisible: boolean): Post[] => {
  const merged = new Map<string, Post>();
  const all = [...localPosts, ...contentPosts];

  all.forEach((post) => {
    if (filterVisible && !isPostVisible(post)) {
      return;
    }
    if (!merged.has(post.id)) {
      merged.set(post.id, post);
    }
  });

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

export function usePosts(options?: { includeDrafts?: boolean }) {
  const localPosts = useBlogStore((state) => state.posts);
  return useMemo(() => mergePosts(localPosts, !options?.includeDrafts), [localPosts, options?.includeDrafts]);
}

export function getAdjacentPosts(posts: Post[], currentId: string) {
  const index = posts.findIndex((post) => post.id === currentId);
  if (index === -1) return { previous: null, next: null };
  const previous = posts[index + 1] ?? null;
  const next = posts[index - 1] ?? null;
  return { previous, next };
}

export function getRelatedPosts(posts: Post[], current: Post, limit = 3): Post[] {
  if (!current.tags.length) return posts.filter((post) => post.id !== current.id).slice(0, limit);
  const scored = posts
    .filter((post) => post.id !== current.id)
    .map((post) => {
      const overlap = post.tags.filter((tag) => current.tags.includes(tag)).length;
      return { post, overlap };
    })
    .sort((a, b) =>
      b.overlap - a.overlap || new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime()
    );

  return scored.filter((item) => item.overlap > 0).map((item) => item.post).slice(0, limit);
}
