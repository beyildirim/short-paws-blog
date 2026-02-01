import { describe, it, expect } from '@jest/globals';
import { renderMarkdown } from '../utils/markdown';

describe('renderMarkdown', () => {
  it('renders markdown to HTML', () => {
    const html = renderMarkdown('# Title');
    expect(html).toContain('<h1');
  });
});
