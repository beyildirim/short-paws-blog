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
        const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT as string | undefined;

        // Validate email format
        if (!isValidEmail(normalizedEmail)) {
          return { success: false, message: 'Please enter a valid email address' };
        }

        if (endpoint) {
          try {
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: normalizedEmail }),
            });

            if (!response.ok) {
              return { success: false, message: 'Subscription failed. Please try again.' };
            }

            return { success: true, message: 'Successfully subscribed! 🎉' };
          } catch (error) {
            console.error('Newsletter subscription error:', error);
            return { success: false, message: 'Subscription failed. Please try again.' };
          }
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
        const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT as string | undefined;
        if (endpoint) {
          return false;
        }
        const emailHash = await hashEmail(normalizedEmail);
        return get().subscribers.some((sub) => sub.emailHash === emailHash);
      },
    }),
    {
      name: STORAGE_KEYS.NEWSLETTER,
      version: 1,
      migrate: (state: unknown) => {
        if (!state || typeof state !== 'object') return state;
        const typedState = state as { subscribers?: Subscriber[] } & Record<string, unknown>;
        if (!Array.isArray(typedState.subscribers)) return state;
        const allHashed = typedState.subscribers.every(
          (sub) => typeof sub.emailHash === 'string' && sub.emailHash.length > 0
        );
        if (!allHashed) {
          return { ...typedState, subscribers: [] };
        }
        return typedState;
      },
    }
  )
);
