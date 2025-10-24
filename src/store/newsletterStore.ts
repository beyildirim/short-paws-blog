import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

interface NewsletterState {
  subscribers: Subscriber[];
  subscribe: (email: string) => { success: boolean; message: string };
  isSubscribed: (email: string) => boolean;
}

export const useNewsletterStore = create<NewsletterState>()(
  persist(
    (set, get) => ({
      subscribers: [],
      subscribe: (email: string) => {
        const { subscribers, isSubscribed } = get();
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return { success: false, message: 'Please enter a valid email address' };
        }
        
        // Check if already subscribed
        if (isSubscribed(email)) {
          return { success: false, message: 'This email is already subscribed!' };
        }
        
        // Add new subscriber
        set({
          subscribers: [
            ...subscribers,
            {
              email,
              subscribedAt: new Date().toISOString(),
            },
          ],
        });
        
        return { success: true, message: 'Successfully subscribed! 🎉' };
      },
      isSubscribed: (email: string) => {
        return get().subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase());
      },
    }),
    {
      name: STORAGE_KEYS.NEWSLETTER,
    }
  )
);
