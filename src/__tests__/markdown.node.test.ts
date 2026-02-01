/** @jest-environment node */
import { describe, it, expect } from '@jest/globals';
import { renderMarkdown } from '../utils/markdown';

describe('renderMarkdown (node environment)', () => {
  it('returns raw HTML when window is undefined', () => {
    const html = renderMarkdown('**bold**');
    expect(html).toContain('<strong>');
  });
});
