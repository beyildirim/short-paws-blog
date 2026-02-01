import { renderMarkdown } from '../utils/markdown';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const html = renderMarkdown(content);
  return (
    <div
      className="prose prose-purple max-w-none break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
