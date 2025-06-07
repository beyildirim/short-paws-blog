import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useAuthStore } from './authStore';
import { useSettingsStore } from './settingsStore';

// reset state before each test
beforeEach(() => {
  useAuthStore.setState({ isAuthenticated: false });
  localStorage.clear();
});

describe('useAuthStore login', () => {
  it('logs in with correct credentials', () => {
    const password = useSettingsStore.getState().settings.adminPassword;
    const result = useAuthStore.getState().login('admin', password);
    expect(result).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('fails with incorrect credentials', () => {
    const result = useAuthStore.getState().login('admin', 'wrong');
    expect(result).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
