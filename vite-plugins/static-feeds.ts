import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { load as loadYaml } from 'js-yaml';
import type { Plugin } from 'vite';

export interface PostMeta {
  slug: string;
  publishedAt: string;
  status: string;
  title?: string;
  excerpt?: string;
}

const STATIC_ROUTES = ['/', '/about', '/blog', '/contact'];

export function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return (loadYaml(match[1].trim()) || {}) as Record<string, unknown>;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function scanPosts(postsDir: string): PostMeta[] {
  const files = readdirSync(postsDir).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const raw = readFileSync(join(postsDir, file), 'utf-8');
    const fm = parseFrontmatter(raw);
    const idFromFile = file.replace(/\.md$/, '');
    const slug = (fm.slug as string) || slugify((fm.title as string) || idFromFile);
    const dateRaw = (fm.publishedAt as string) || (fm.date as string);
    const parsed = dateRaw ? new Date(dateRaw) : new Date();
    const publishedAt = Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();

    return {
      slug,
      publishedAt,
      status: (fm.status as string) || 'published',
      title: (fm.title as string) || slug,
      excerpt: (fm.excerpt as string) || '',
    };
  });
}

export function generateSitemap(baseUrl: string, posts: PostMeta[]): string {
  const published = posts.filter(p => p.status === 'published');
  const staticEntries = STATIC_ROUTES.map(route => {
    const freq = route === '/blog' ? 'weekly' : 'monthly';
    return `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>${freq}</changefreq>\n  </url>`;
  });
  const postEntries = published.map(post =>
    `  <url>\n    <loc>${baseUrl}/blog/${post.slug}</loc>\n    <lastmod>${post.publishedAt.split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...postEntries,
    '</urlset>',
  ].join('\n');
}

export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`;
}

export function generateRss(baseUrl: string, posts: PostMeta[], siteTitle: string, siteDescription: string): string {
  const published = posts
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const items = published.map(post => `    <item>
      <title>${escapeXml(post.title || post.slug)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
    </item>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>`;
}

export function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function staticFeedsPlugin(options: { siteUrl: string; siteTitle: string; siteDescription: string }): Plugin {
  return {
    name: 'static-feeds',
    closeBundle() {
      const postsDir = resolve(import.meta.dirname, '../src/content/posts');
      const outDir = resolve(import.meta.dirname, '../dist');
      const posts = scanPosts(postsDir);

      writeFileSync(join(outDir, 'sitemap.xml'), generateSitemap(options.siteUrl, posts));
      writeFileSync(join(outDir, 'robots.txt'), generateRobotsTxt(options.siteUrl));
      writeFileSync(join(outDir, 'rss.xml'), generateRss(options.siteUrl, posts, options.siteTitle, options.siteDescription));

      console.log('[static-feeds] Generated sitemap.xml, robots.txt, rss.xml');
    },
  };
}
