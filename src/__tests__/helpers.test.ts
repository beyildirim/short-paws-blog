import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import {
  formatDate,
  formatRelativeTime,
  truncateText,
  slugify,
  getCurrentUrl,
  copyToClipboard,
  scrollToElement,
  debounce,
  generateId,
  estimateReadTime,
} from '../utils/helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    it('formats string dates', () => {
      expect(formatDate('2024-01-02')).toContain('2024');
    });

    it('formats Date objects', () => {
      const date = new Date('2024-02-03T00:00:00Z');
      expect(formatDate(date)).toContain('2024');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('handles seconds, minutes, hours, and days', () => {
      expect(formatRelativeTime(new Date('2023-12-31T23:59:50Z'))).toBe('just now');
      expect(formatRelativeTime(new Date('2023-12-31T23:50:00Z'))).toContain('minute');
      expect(formatRelativeTime(new Date('2023-12-31T20:00:00Z'))).toContain('hour');
      expect(formatRelativeTime(new Date('2023-12-26T00:00:00Z'))).toContain('day');
    });

    it('falls back to formatDate for older dates', () => {
      expect(formatRelativeTime(new Date('2023-11-01T00:00:00Z'))).toContain('2023');
    });

    it('uses singular labels when value is one', () => {
      expect(formatRelativeTime(new Date('2023-12-31T23:59:00Z'))).toBe('1 minute ago');
      expect(formatRelativeTime(new Date('2023-12-31T23:00:00Z'))).toBe('1 hour ago');
      expect(formatRelativeTime(new Date('2023-12-31T00:00:00Z'))).toBe('1 day ago');
    });
  });

  it('truncates text', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
    expect(truncateText('short', 10)).toBe('short');
  });

  it('slugifies text', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('  Trim -- Me ')).toBe('trim-me');
  });

  it('returns current url when window is defined', () => {
    expect(getCurrentUrl()).toBe(window.location.href);
  });

  it('copies to clipboard successfully', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    await expect(copyToClipboard('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('handles clipboard errors', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const writeText = jest.fn().mockRejectedValue(new Error('fail'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    await expect(copyToClipboard('hello')).resolves.toBe(false);
    errorSpy.mockRestore();
  });

  it('scrolls to element when found', () => {
    const target = document.createElement('div');
    target.id = 'target';
    document.body.appendChild(target);
    const spy = jest.spyOn(target, 'scrollIntoView');
    scrollToElement('target');
    expect(spy).toHaveBeenCalled();
    target.remove();
  });

  it('does nothing when element is missing', () => {
    expect(() => scrollToElement('missing')).not.toThrow();
  });

  it('debounces function calls', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const debounced = debounce(fn, 200);
    debounced('a');
    debounced('b');
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
    jest.useRealTimers();
  });

  it('generates ids with prefix using crypto when available', () => {
    const originalCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', {
      value: { randomUUID: () => 'abc-123' },
      configurable: true,
    });
    expect(generateId('post')).toBe('post-abc-123');
    Object.defineProperty(globalThis, 'crypto', { value: originalCrypto, configurable: true });
  });

  it('generates ids without crypto.randomUUID', () => {
    const originalCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', { value: {}, configurable: true });
    const id = generateId();
    expect(id).toMatch(/^\d+-/);
    Object.defineProperty(globalThis, 'crypto', { value: originalCrypto, configurable: true });
  });

  it('estimates read time', () => {
    const text = 'word '.repeat(400);
    expect(estimateReadTime(text, 200)).toBe('2 min read');
    expect(estimateReadTime('')).toBe('1 min read');
  });
});
