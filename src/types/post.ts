export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  status: PostStatus;
  tags: string[];
  icon: 'boxes' | 'cat' | 'brain' | 'heartHandshake';
  coverImage?: string;
  author?: string;
  readTime?: string;
  source: 'content' | 'local';
}
