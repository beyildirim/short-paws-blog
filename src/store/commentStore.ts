import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';
import { isValidEmail } from '../utils/crypto';
import { generateId } from '../utils/helpers';

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentState {
  comments: Comment[];
  addComment: (postId: string, author: string, email: string, content: string) => { success: boolean; message: string };
  getCommentsByPostId: (postId: string) => Comment[];
  deleteComment: (commentId: string) => void;
}

export const useCommentStore = create<CommentState>()(
  persist(
    (set, get) => ({
      comments: [],
      addComment: (postId: string, author: string, email: string, content: string) => {
        // Validate inputs
        if (!author.trim() || !email.trim() || !content.trim()) {
          return { success: false, message: 'All fields are required' };
        }
        
        if (!isValidEmail(email)) {
          return { success: false, message: 'Please enter a valid email address' };
        }
        
        if (content.length < 10) {
          return { success: false, message: 'Comment must be at least 10 characters long' };
        }
        
        if (content.length > 1000) {
          return { success: false, message: 'Comment must be less than 1000 characters' };
        }
        
        // Add new comment
        const newComment: Comment = {
          id: generateId('comment'),
          postId,
          author: author.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          comments: [...state.comments, newComment],
        }));
        
        return { success: true, message: 'Comment posted successfully! 💬' };
      },
      getCommentsByPostId: (postId: string) => {
        return get().comments
          .filter(comment => comment.postId === postId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      deleteComment: (commentId: string) => {
        set((state) => ({
          comments: state.comments.filter(comment => comment.id !== commentId),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.COMMENTS,
      version: 1,
      migrate: (state: any) => {
        if (!state?.comments) return state;
        const sanitized = state.comments.map(({ email: _email, ...rest }: any) => rest);
        return { ...state, comments: sanitized };
      },
    }
  )
);
