import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Boxes, Cat, Brain, HeartHandshake } from 'lucide-react';
export type IconName = 'boxes' | 'cat' | 'brain' | 'heartHandshake';
export const iconMap: Record<IconName, any> = {
  boxes: Boxes,
  cat: Cat,
  brain: Brain,
  heartHandshake: HeartHandshake,
};

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  icon: IconName;
}

interface BlogState {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id' | 'date'>) => void;
  editPost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
}

const initialPosts = [
  {
    id: "supply-chain-whiskers",
    title: "Supply Chain Management: A Cat's Eye View",
    date: "March 15, 2024",
    readTime: "5 min read",
    excerpt: "How feline intuition and strategic planning come together to create purr-fect supply chain solutions. Discover my unique approach to managing complex logistics.",
    content: `As a cat with a keen eye for detail and natural curiosity, I've discovered that supply chain management is surprisingly similar to feline instincts...`,
    icon: 'boxes',
  },
  {
    id: "planning-specialist-journey",
    title: "From Curious Cat to Planning Specialist",
    date: "March 10, 2024",
    readTime: "4 min read",
    excerpt: "My journey from being a naturally curious cat to becoming a professional planning specialist. Learn about the skills that make me unique in this field.",
    content: `Every cat has a story, and mine began with an insatiable curiosity about organization and planning...`,
    icon: 'cat',
  },
  {
    id: "strategic-thinking",
    title: "Strategic Thinking: Combining Instinct with Analytics",
    date: "March 5, 2024",
    readTime: "6 min read",
    excerpt: "How I blend natural feline instincts with data-driven analysis to create comprehensive strategic plans that work.",
    content: `In the world of strategic planning, the combination of natural instinct and analytical thinking creates a powerful approach...`,
    icon: 'brain',
  },
  {
    id: "client-relationships",
    title: "Building Purr-fect Client Relationships",
    date: "February 28, 2024",
    readTime: "4 min read",
    excerpt: "The art of maintaining strong client relationships while delivering exceptional planning services. A blend of professionalism and personality.",
    content: `In the world of professional planning, building and maintaining strong client relationships is as crucial as technical expertise...`,
    icon: 'heartHandshake',
  },
];

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      posts: initialPosts,
      addPost: (post) => set((state) => ({
        posts: [
          {
            ...post,
            id: `${Date.now()}`,
            date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          },
          ...state.posts,
        ],
      })),
      editPost: (id, updatedPost) => set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id ? { ...post, ...updatedPost } : post
        ),
      })),
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter((post) => post.id !== id),
      })),
    }),
    {
      name: 'blog-storage',
    }
  )
);