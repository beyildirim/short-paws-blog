import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useSettingsStore } from './settingsStore';
import { loginRateLimiter, verifyPassword } from '../utils/crypto';
import { ADMIN_USERNAME, STORAGE_KEYS } from '../constants';

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        const settings = useSettingsStore.getState().settings;

        if (!settings.adminPassword) {
          return { success: false, error: 'Admin password has not been set yet.' };
        }

        if (!loginRateLimiter.canAttempt(username)) {
          const retryMs = loginRateLimiter.getRetryAfterMs(username);
          const retrySeconds = Math.max(1, Math.ceil(retryMs / 1000));
          const retryText = retrySeconds >= 60
            ? `${Math.ceil(retrySeconds / 60)} minute(s)`
            : `${retrySeconds} second(s)`;
          return { success: false, error: `Too many attempts. Try again in ${retryText}.` };
        }

        if (username !== ADMIN_USERNAME) {
          return { success: false, error: 'Invalid username or password.' };
        }

        // Hash the input password and compare with stored hash
        const { valid, upgradedHash } = await verifyPassword(password, settings.adminPassword);

        if (valid) {
          if (upgradedHash) {
            useSettingsStore.getState().updateSettings({ adminPassword: upgradedHash });
          }
          set({ isAuthenticated: true });
          loginRateLimiter.reset(username);
          return { success: true };
        }

        return { success: false, error: 'Invalid username or password.' };
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
