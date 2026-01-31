import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(markdown: string): string {
  const html = marked.parse(markdown) as string;
  if (typeof window === 'undefined') {
    return html;
  }
  return DOMPurify.sanitize(html);
}
