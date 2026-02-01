import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useSettingsStore } from './settingsStore';
import { loginRateLimiter, verifyPassword } from '../utils/crypto';
import { ADMIN_USERNAME, STORAGE_KEYS } from '../constants';

interface AuthState {
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
  sessionExpired: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  ensureSession: () => boolean;
  refreshSession: () => void;
  clearSessionExpired: () => void;
  logout: () => void;
}

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_REFRESH_THRESHOLD_MS = 2 * 60 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      sessionExpiresAt: null,
      sessionExpired: false,
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
          set({
            isAuthenticated: true,
            sessionExpiresAt: Date.now() + SESSION_TTL_MS,
            sessionExpired: false,
          });
          loginRateLimiter.reset(username);
          return { success: true };
        }

        return { success: false, error: 'Invalid username or password.' };
      },
      ensureSession: () => {
        const { isAuthenticated, sessionExpiresAt } = get();
        if (!isAuthenticated) return false;
        if (!sessionExpiresAt) {
          set({ sessionExpiresAt: Date.now() + SESSION_TTL_MS, sessionExpired: false });
          return true;
        }
        if (Date.now() > sessionExpiresAt) {
          set({ isAuthenticated: false, sessionExpiresAt: null, sessionExpired: true });
          return false;
        }
        if (get().sessionExpired) {
          set({ sessionExpired: false });
        }
        return true;
      },
      refreshSession: () => {
        if (!get().isAuthenticated) return;
        const currentExpiry = get().sessionExpiresAt;
        if (currentExpiry && currentExpiry - Date.now() > SESSION_REFRESH_THRESHOLD_MS) {
          return;
        }
        set({ sessionExpiresAt: Date.now() + SESSION_TTL_MS, sessionExpired: false });
      },
      clearSessionExpired: () => set({ sessionExpired: false }),
      logout: () => set({ isAuthenticated: false, sessionExpiresAt: null, sessionExpired: false }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.ensureSession();
      },
    }
  )
);
