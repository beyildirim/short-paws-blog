import { load as loadYaml } from 'js-yaml';
import type { Post, PostStatus } from '../../types/post';
import { estimateReadTime, slugify } from '../../utils/helpers';

interface Frontmatter {
  title?: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  publishedAt?: string;
  updatedAt?: string;
  status?: PostStatus;
  tags?: string[] | string;
  icon?: Post['icon'];
  coverImage?: string;
  author?: string;
}

type GlobLoader = (
  pattern: string,
  options: { eager: true; query: string; import: 'default' }
) => Record<string, string>;

const glob = (import.meta as ImportMeta & { glob?: GlobLoader }).glob;
const modules = glob ? glob('./*.md', { eager: true, query: '?raw', import: 'default' }) : {};

const parseFrontmatter = (raw: string): { data: Frontmatter; content: string } => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { data: {}, content: raw };
  }
  const yamlSource = match[1].trim();
  const data = (loadYaml(yamlSource) || {}) as Frontmatter;
  const content = raw.slice(match[0].length).trim();
  return { data, content };
};

const normalizeTags = (value?: string[] | string): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((tag) => tag.toLowerCase().trim()).filter(Boolean);
  return value.split(',').map((tag) => tag.toLowerCase().trim()).filter(Boolean);
};

const parsePublishedAt = (data: Frontmatter): string => {
  const raw = data.publishedAt || data.date;
  if (!raw) {
    return new Date().toISOString();
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

export const contentPosts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const frontmatter = data as Frontmatter;
    const idFromFile = path.split('/').pop()?.replace(/\.md$/, '') ?? '';
    const slug = frontmatter.slug || slugify(frontmatter.title || idFromFile);
    const status = frontmatter.status || 'published';

    return {
      id: slug,
      title: frontmatter.title || slug,
      excerpt: frontmatter.excerpt || content.slice(0, 140).trim() + '…',
      content: content.trim(),
      publishedAt: parsePublishedAt(frontmatter),
      updatedAt: frontmatter.updatedAt,
      status,
      tags: normalizeTags(frontmatter.tags),
      icon: frontmatter.icon || 'cat',
      coverImage: frontmatter.coverImage,
      author: frontmatter.author,
      readTime: estimateReadTime(content),
      source: 'content',
    } satisfies Post;
  })
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const isPostVisible = (post: Post, now: Date = new Date()): boolean => {
  if (post.status === 'draft') return false;
  if (post.status === 'scheduled') {
    return new Date(post.publishedAt).getTime() <= now.getTime();
  }
  return true;
};
