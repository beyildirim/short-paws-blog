/** @jest-environment node */
import { describe, it, expect } from '@jest/globals';
import { getCurrentUrl } from '../utils/helpers';

describe('helpers (node environment)', () => {
  it('returns empty string when window is undefined', () => {
    expect(getCurrentUrl()).toBe('');
  });
});
