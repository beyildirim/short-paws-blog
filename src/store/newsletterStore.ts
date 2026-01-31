import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';
import { hashEmail, isValidEmail, normalizeEmail } from '../utils/crypto';

export interface Subscriber {
  emailHash: string;
  subscribedAt: string;
}

interface NewsletterState {
  subscribers: Subscriber[];
  subscribe: (email: string) => Promise<{ success: boolean; message: string }>;
  isSubscribed: (email: string) => Promise<boolean>;
}

export const useNewsletterStore = create<NewsletterState>()(
  persist(
    (set, get) => ({
      subscribers: [],
      subscribe: async (email: string) => {
        const normalizedEmail = normalizeEmail(email);
        const { subscribers } = get();

        // Validate email format
        if (!isValidEmail(normalizedEmail)) {
          return { success: false, message: 'Please enter a valid email address' };
        }

        const emailHash = await hashEmail(normalizedEmail);

        // Check if already subscribed
        if (subscribers.some((sub) => sub.emailHash === emailHash)) {
          return { success: false, message: 'This email is already subscribed!' };
        }

        // Add new subscriber (hashed email only)
        set({
          subscribers: [
            ...subscribers,
            {
              emailHash,
              subscribedAt: new Date().toISOString(),
            },
          ],
        });

        return { success: true, message: 'Successfully subscribed! 🎉' };
      },
      isSubscribed: async (email: string) => {
        const normalizedEmail = normalizeEmail(email);
        if (!isValidEmail(normalizedEmail)) {
          return false;
        }
        const emailHash = await hashEmail(normalizedEmail);
        return get().subscribers.some((sub) => sub.emailHash === emailHash);
      },
    }),
    {
      name: STORAGE_KEYS.NEWSLETTER,
    }
  )
);
