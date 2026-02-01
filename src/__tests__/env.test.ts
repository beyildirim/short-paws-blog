import { describe, it, expect } from '@jest/globals';
import { getEnv, getEnvBoolean } from '../utils/env';

describe('env helpers', () => {
  it('reads from global __ENV__ when available', () => {
    (globalThis as { __ENV__?: Record<string, string | boolean> }).__ENV__ = {
      VITE_ENABLE_ADMIN: 'true',
      DEV: true,
      VITE_PLAUSIBLE_DOMAIN: 'example.com',
    };

    expect(getEnv('VITE_PLAUSIBLE_DOMAIN')).toBe('example.com');
    expect(getEnvBoolean('VITE_ENABLE_ADMIN')).toBe(true);
    expect(getEnvBoolean('DEV')).toBe(true);
  });

  it('returns false for missing boolean envs', () => {
    (globalThis as { __ENV__?: Record<string, string | boolean> }).__ENV__ = {};
    expect(getEnvBoolean('VITE_ENABLE_ADMIN')).toBe(false);
  });

  it('reads from import meta override when available', () => {
    (globalThis as { __IMPORT_META_ENV__?: Record<string, string> }).__IMPORT_META_ENV__ = {
      VITE_PLAUSIBLE_DOMAIN: 'meta.example.com',
    };
    expect(getEnv('VITE_PLAUSIBLE_DOMAIN')).toBe('meta.example.com');
    (globalThis as { __IMPORT_META_ENV__?: Record<string, string> }).__IMPORT_META_ENV__ = undefined;
  });
});
