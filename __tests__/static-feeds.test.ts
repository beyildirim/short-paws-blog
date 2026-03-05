import { describe, it, expect } from '@jest/globals';
import { generateSitemap, generateRobotsTxt, generateRss } from '../vite-plugins/static-feeds';

describe('generateSitemap', () => {
  const baseUrl = 'https://shortpaws.netlify.app';
  const posts = [
    { slug: 'hello-world', publishedAt: '2024-03-10T00:00:00.000Z', status: 'published' as const },
    { slug: 'draft-post', publishedAt: '2024-03-11T00:00:00.000Z', status: 'draft' as const },
  ];

  it('includes static routes', () => {
    const xml = generateSitemap(baseUrl, posts);
    expect(xml).toContain(`<loc>${baseUrl}/</loc>`);
    expect(xml).toContain(`<loc>${baseUrl}/about</loc>`);
    expect(xml).toContain(`<loc>${baseUrl}/blog</loc>`);
    expect(xml).toContain(`<loc>${baseUrl}/contact</loc>`);
  });

  it('includes published posts only', () => {
    const xml = generateSitemap(baseUrl, posts);
    expect(xml).toContain(`<loc>${baseUrl}/blog/hello-world</loc>`);
    expect(xml).not.toContain('draft-post');
  });

  it('produces valid XML structure', () => {
    const xml = generateSitemap(baseUrl, posts);
    expect(xml).toMatch(/^<\?xml version="1\.0"/);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('</urlset>');
  });
});

describe('generateRobotsTxt', () => {
  it('references sitemap URL', () => {
    const txt = generateRobotsTxt('https://shortpaws.netlify.app');
    expect(txt).toContain('Sitemap: https://shortpaws.netlify.app/sitemap.xml');
    expect(txt).toContain('User-agent: *');
    expect(txt).toContain('Allow: /');
  });
});

describe('generateRss', () => {
  const baseUrl = 'https://shortpaws.netlify.app';
  const posts = [
    { slug: 'first', publishedAt: '2024-03-10T00:00:00.000Z', status: 'published' as const, title: 'First Post', excerpt: 'Hello world' },
    { slug: 'draft', publishedAt: '2024-03-11T00:00:00.000Z', status: 'draft' as const, title: 'Draft', excerpt: '' },
  ];

  it('produces valid RSS 2.0 structure', () => {
    const xml = generateRss(baseUrl, posts, 'Test Blog', 'A test blog');
    expect(xml).toMatch(/^<\?xml version="1\.0"/);
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain('<channel>');
    expect(xml).toContain('<title>Test Blog</title>');
  });

  it('includes published posts only', () => {
    const xml = generateRss(baseUrl, posts, 'Test Blog', 'A test blog');
    expect(xml).toContain('<title>First Post</title>');
    expect(xml).not.toContain('Draft');
  });

  it('escapes XML special characters', () => {
    const postsWithSpecial = [
      { slug: 'special', publishedAt: '2024-03-10T00:00:00.000Z', status: 'published' as const, title: 'Cats & Dogs', excerpt: '<script>alert("xss")</script>' },
    ];
    const xml = generateRss(baseUrl, postsWithSpecial, 'Test', 'Desc');
    expect(xml).toContain('Cats &amp; Dogs');
    expect(xml).toContain('&lt;script&gt;');
  });
});
