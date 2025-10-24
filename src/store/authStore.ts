import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSettingsStore } from './settingsStore';
import { verifyPassword } from '../utils/crypto';
import { ADMIN_USERNAME, STORAGE_KEYS } from '../constants';

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        const settings = useSettingsStore.getState().settings;

        if (username !== ADMIN_USERNAME) {
          return false;
        }

        // Hash the input password and compare with stored hash
        const isValid = await verifyPassword(password, settings.adminPassword);

        if (isValid) {
          set({ isAuthenticated: true });
          return true;
        }

        return false;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
    }
  )
);