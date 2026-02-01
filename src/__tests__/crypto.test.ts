import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import {
  hashPassword,
  verifyPassword,
  validatePassword,
  sanitizeHtml,
  normalizeEmail,
  isValidEmail,
  hashEmail,
  formRateLimiter,
  loginRateLimiter,
} from '../utils/crypto';

const sha256Hex = async (input: string): Promise<string> => {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

describe('crypto utils', () => {
  it('validates password strength', () => {
    expect(validatePassword('short').valid).toBe(false);
    expect(validatePassword('longpassword').valid).toBe(false);
    expect(validatePassword('Strong12345').valid).toBe(true);
  });

  it('sanitizes HTML', () => {
    const dirty = '<img src=x onerror=alert(1)>';
    const clean = sanitizeHtml(dirty);
    expect(clean).toContain('&lt;img');
    expect(clean).not.toContain('<img');
  });

  it('normalizes and validates email', () => {
    expect(normalizeEmail(' Test@Email.COM ')).toBe('test@email.com');
    expect(isValidEmail('bad-email')).toBe(false);
    expect(isValidEmail('good@example.com')).toBe(true);
  });

  it('hashes emails consistently', async () => {
    const hash1 = await hashEmail('Test@Email.com');
    const hash2 = await hashEmail('test@email.com');
    expect(hash1).toBe(hash2);
  });

  it('hashes and verifies passwords', async () => {
    const hash = await hashPassword('Password123');
    const result = await verifyPassword('Password123', hash);
    expect(result.valid).toBe(true);
    const invalid = await verifyPassword('wrong', hash);
    expect(invalid.valid).toBe(false);
  });

  it('upgrades legacy sha256 hashes', async () => {
    const legacy = await sha256Hex('Password123');
    const result = await verifyPassword('Password123', legacy);
    expect(result.valid).toBe(true);
    expect(result.upgradedHash).toMatch(/^pbkdf2\$/);
  });

  it('rejects invalid stored hashes', async () => {
    const result = await verifyPassword('Password123', 'invalid-hash');
    expect(result.valid).toBe(false);
  });

  it('rejects empty or malformed stored hashes', async () => {
    const empty = await verifyPassword('Password123', '');
    expect(empty.valid).toBe(false);
    const badParts = await verifyPassword('Password123', 'pbkdf2$1$onlythree');
    expect(badParts.valid).toBe(false);
    const badIterations = await verifyPassword('Password123', 'pbkdf2$9999$bad$bad');
    expect(badIterations.valid).toBe(false);
    const nanIterations = await verifyPassword('Password123', 'pbkdf2$abc$bad$bad');
    expect(nanIterations.valid).toBe(false);
  });

  it('fails when stored hash length mismatches derived key', async () => {
    const salt = 'AQIDBAUGBwgJCgsMDQ4PEA==';
    const shortKey = 'AQI=';
    const result = await verifyPassword('Password123', `pbkdf2$120000$${salt}$${shortKey}`);
    expect(result.valid).toBe(false);
  });

  describe('rate limiter', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    });

    afterEach(() => {
      formRateLimiter.reset('contact-form');
      loginRateLimiter.reset('admin');
      jest.useRealTimers();
    });

    it('limits attempts within window', () => {
      expect(formRateLimiter.canAttempt('contact-form')).toBe(true);
      expect(formRateLimiter.canAttempt('contact-form')).toBe(true);
      expect(formRateLimiter.canAttempt('contact-form')).toBe(true);
      expect(formRateLimiter.canAttempt('contact-form')).toBe(true);
      expect(formRateLimiter.canAttempt('contact-form')).toBe(true);
      expect(formRateLimiter.canAttempt('contact-form')).toBe(false);
      expect(formRateLimiter.getRetryAfterMs('contact-form')).toBeGreaterThan(0);
    });

    it('returns zero retry time when attempts are below limit', () => {
      expect(formRateLimiter.getRetryAfterMs('unused')).toBe(0);
    });

    it('allows attempts after window passes', () => {
      expect(loginRateLimiter.canAttempt('admin')).toBe(true);
      expect(loginRateLimiter.canAttempt('admin')).toBe(true);
      expect(loginRateLimiter.canAttempt('admin')).toBe(true);
      expect(loginRateLimiter.canAttempt('admin')).toBe(false);
      jest.advanceTimersByTime(300000);
      expect(loginRateLimiter.canAttempt('admin')).toBe(true);
    });
  });
});
