# Phase 0-1 Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete all remaining Phase 0 and Phase 1 issues (#154, #155, #156, #160, #161) and verify already-done issues (#157, #158, #159).

**Architecture:** Custom Vite plugin generates sitemap.xml, robots.txt, and rss.xml at build time by scanning markdown post files. Settings seed gets a siteUrl default. TagFilter gets accessibility attributes. Blog empty state gets a "Clear filters" button.

**Tech Stack:** Vite plugin API, js-yaml (already installed), React, TypeScript, Jest

---

### Task 1: Vite Static Feeds Plugin — Scaffold and Sitemap Test

**Files:**
- Create: `vite-plugins/static-feeds.ts`
- Test: `__tests__/static-feeds.test.ts`

**Step 1: Write the failing test for sitemap generation**

Create `__tests__/static-feeds.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals';
import { generateSitemap } from '../vite-plugins/static-feeds';

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
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/static-feeds.test.ts`
Expected: FAIL — cannot find module `../vite-plugins/static-feeds`

**Step 3: Write minimal implementation**

Create `vite-plugins/static-feeds.ts`:

```typescript
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { load as loadYaml } from 'js-yaml';
import type { Plugin } from 'vite';

interface PostMeta {
  slug: string;
  publishedAt: string;
  status: string;
  title?: string;
  excerpt?: string;
}

const STATIC_ROUTES = ['/', '/about', '/blog', '/contact'];

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return (loadYaml(match[1].trim()) || {}) as Record<string, unknown>;
}

function slugify(text: string): string {
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

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function staticFeedsPlugin(options: { siteUrl: string; siteTitle: string; siteDescription: string }): Plugin {
  return {
    name: 'static-feeds',
    closeBundle() {
      const postsDir = resolve(__dirname, '../src/content/posts');
      const outDir = resolve(__dirname, '../dist');
      const posts = scanPosts(postsDir);

      writeFileSync(join(outDir, 'sitemap.xml'), generateSitemap(options.siteUrl, posts));
      writeFileSync(join(outDir, 'robots.txt'), generateRobotsTxt(options.siteUrl));
      writeFileSync(join(outDir, 'rss.xml'), generateRss(options.siteUrl, posts, options.siteTitle, options.siteDescription));

      console.log('[static-feeds] Generated sitemap.xml, robots.txt, rss.xml');
    },
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/static-feeds.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add vite-plugins/static-feeds.ts __tests__/static-feeds.test.ts
git commit -m "feat: add static feeds Vite plugin with sitemap generation (#160)"
```

---

### Task 2: Robots.txt and RSS Tests

**Files:**
- Modify: `__tests__/static-feeds.test.ts`

**Step 1: Write failing tests for robots.txt and RSS**

Append to `__tests__/static-feeds.test.ts`:

```typescript
import { generateRobotsTxt, generateRss } from '../vite-plugins/static-feeds';

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
```

**Step 2: Run tests to verify they pass** (implementation already exists from Task 1)

Run: `npm test -- __tests__/static-feeds.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add __tests__/static-feeds.test.ts
git commit -m "test: add robots.txt and RSS generation tests (#160, #161)"
```

---

### Task 3: Register Plugin in Vite Config

**Files:**
- Modify: `vite.config.ts` (lines 1-18)

**Step 1: Import and register the plugin**

Add to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { staticFeedsPlugin } from './vite-plugins/static-feeds';
import settings from './src/data/settings.json';

export default defineConfig({
  plugins: [
    react(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'short-paws-blog',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
    staticFeedsPlugin({
      siteUrl: settings.seo?.siteUrl || 'https://shortpaws.netlify.app',
      siteTitle: settings.title || "Gizmeli Kedi's Personal Website",
      siteDescription: settings.description || '',
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

**Step 2: Run build to verify plugin generates files**

Run: `npm run build && ls dist/sitemap.xml dist/robots.txt dist/rss.xml`
Expected: All three files listed

**Step 3: Verify file contents**

Run: `head -5 dist/sitemap.xml && echo "---" && cat dist/robots.txt && echo "---" && head -10 dist/rss.xml`
Expected: Valid XML/text with correct URLs

**Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "feat: register static-feeds plugin in Vite config (#160, #161)"
```

---

### Task 4: Settings Seed — Set siteUrl (#155)

**Files:**
- Modify: `src/data/settings.json` (line 14, `seo.siteUrl`)

**Step 1: Update settings.json**

Change line 14 in `src/data/settings.json`:
```json
"siteUrl": "https://shortpaws.netlify.app",
```

**Step 2: Verify settings merge in store**

Read `src/store/settingsStore.ts` lines 128-155 to confirm `mergeSettings` does deep merge — new defaults won't overwrite existing localStorage values. Verify by inspection.

**Step 3: Run existing tests to confirm nothing breaks**

Run: `npm test -- __tests__/newStores.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add src/data/settings.json
git commit -m "fix: set siteUrl default to shortpaws.netlify.app (#155)"
```

---

### Task 5: Deploy Parity Audit (#154)

**Files:**
- Modify: `netlify.toml` (add SPA redirect rule)

**Step 1: Add SPA redirect to netlify.toml**

`netlify.toml` already has build config (lines 1-7). Add redirect rule:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Step 2: Verify build succeeds locally**

Run: `npm run build`
Expected: Build completes without errors, `dist/` contains index.html, assets, sitemap.xml, robots.txt, rss.xml

**Step 3: Verify Tailwind CSS is in output**

Run: `grep -l "purple" dist/assets/*.css 2>/dev/null | head -1 && echo "Tailwind CSS present"`
Expected: At least one CSS file found containing purple color references

**Step 4: Commit**

```bash
git add netlify.toml
git commit -m "fix: add SPA redirect rule to netlify.toml (#154)"
```

---

### Task 6: TagFilter Accessibility (#156)

**Files:**
- Modify: `src/components/TagFilter.tsx` (lines 7-37)
- Modify: `__tests__/components.test.tsx` (add accessibility tests)

**Step 1: Write failing accessibility tests**

Add to `__tests__/components.test.tsx`:

```typescript
describe('TagFilter accessibility', () => {
  const tags = ['career', 'planning'];
  const onChange = jest.fn();

  it('has role="group" with aria-label', () => {
    render(<TagFilter tags={tags} activeTag={null} onChange={onChange} />);
    const group = screen.getByRole('group', { name: /filter by tag/i });
    expect(group).toBeInTheDocument();
  });

  it('sets aria-pressed on active tag', () => {
    render(<TagFilter tags={tags} activeTag="career" onChange={onChange} />);
    const careerBtn = screen.getByText('#career');
    expect(careerBtn).toHaveAttribute('aria-pressed', 'true');
    const planningBtn = screen.getByText('#planning');
    expect(planningBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('sets aria-pressed on All button when no tag active', () => {
    render(<TagFilter tags={tags} activeTag={null} onChange={onChange} />);
    const allBtn = screen.getByText('All');
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- __tests__/components.test.tsx`
Expected: FAIL — missing `role` and `aria-pressed`

**Step 3: Update TagFilter.tsx**

```typescript
export function TagFilter({ tags, activeTag, onChange }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <button
        onClick={() => onChange(null)}
        aria-pressed={activeTag === null}
        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
          activeTag === null
            ? 'bg-purple-600 text-white border-purple-600'
            : 'bg-white text-purple-600 border-purple-300 hover:border-purple-500'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          aria-pressed={activeTag === tag}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            activeTag === tag
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-purple-600 border-purple-300 hover:border-purple-500'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- __tests__/components.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/TagFilter.tsx __tests__/components.test.tsx
git commit -m "fix: add accessibility attributes to TagFilter (#156)"
```

---

### Task 7: Blog Empty State with Clear Filters (#156)

**Files:**
- Modify: `src/pages/Blog.tsx` (lines 98-102)

**Step 1: Write failing test for clear filters button**

Add to `__tests__/pages.test.tsx`:

```typescript
describe('Blog empty state', () => {
  it('shows clear filters button when no posts match', async () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <Blog />
      </MemoryRouter>
    );
    const searchInput = screen.getByLabelText('Search blog posts');
    await userEvent.type(searchInput, 'xyznonexistent');
    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/pages.test.tsx`
Expected: FAIL — no "Clear filters" button found

**Step 3: Update Blog.tsx empty state**

Replace lines 98-102 in `src/pages/Blog.tsx`:

```tsx
{visiblePosts.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-4xl mb-4">🐱</p>
    <p className="text-gray-600 text-lg mb-2">No posts found</p>
    <p className="text-gray-500 mb-4">
      {searchQuery
        ? `No results for "${searchQuery}"`
        : 'No posts match the selected tag'}
    </p>
    <button
      onClick={() => {
        setSearchQuery('');
        setActiveTag(null);
      }}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      aria-label="Clear filters"
    >
      Clear filters
    </button>
  </div>
) : (
```

Note: The BlogSearch component manages its own local `query` state. To reset it, Blog.tsx needs to pass a `key` prop or the search component needs a reset mechanism. Check if `BlogSearch` accepts a controlled value prop. If not, the simplest fix is to add a `key` that forces remount:

In Blog.tsx, change:
```tsx
<BlogSearch onSearch={setSearchQuery} key={searchQuery === '' ? 'reset' : 'active'} />
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/pages.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/Blog.tsx __tests__/pages.test.tsx
git commit -m "feat: add clear filters button to blog empty state (#156)"
```

---

### Task 8: Verify and Close Already-Done Issues

**Files:** None to modify — verification only.

**Step 1: Verify #157 (related posts + prev/next)**

Check `src/pages/BlogPost.tsx`:
- Lines 33-36: `getAdjacentPosts()` — prev/next navigation exists
- Lines 38-41: `getRelatedPosts()` — related posts by tag overlap exists
- Lines 203-230: Prev/next navigation UI rendered
- Lines 232-248: Related posts section rendered
- Verify responsive: check for grid classes (`grid-cols-1 md:grid-cols-3` or similar)

Run: `npm test -- __tests__/pages.test.tsx`
Expected: PASS

**Step 2: Verify #158 (SEO meta + OG/Twitter + canonical)**

Check `src/pages/BlogPost.tsx` for Helmet usage:
- Confirm `<title>` set per route
- Confirm `og:title`, `og:description`, `og:image` meta tags
- Confirm `twitter:card`, `twitter:title` meta tags
- Confirm `<link rel="canonical">` tag

Also check other pages (Home, About, Contact, Blog) for Helmet meta tags.

**Step 3: Verify #159 (JSON-LD schema)**

Check `src/pages/BlogPost.tsx` for JSON-LD script tag:
- Confirm `@type: "BlogPosting"` or `"Article"`
- Confirm `headline`, `datePublished`, `author` fields
- Confirm `image` field included when coverImage present

**Step 4: Document findings and close issues**

If all acceptance criteria met, close via:
```bash
gh issue close 157 -c "Verified: related posts and prev/next navigation already implemented in BlogPost.tsx"
gh issue close 158 -c "Verified: SEO meta, OG, Twitter cards, and canonical URLs already implemented across all pages"
gh issue close 159 -c "Verified: JSON-LD BlogPosting schema already implemented in BlogPost.tsx"
```

---

### Task 9: Final Integration Test

**Step 1: Run full test suite**

Run: `npm test`
Expected: All tests PASS

**Step 2: Run build and verify outputs**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Verify all generated files**

Run: `ls -la dist/sitemap.xml dist/robots.txt dist/rss.xml`
Expected: All three files exist with non-zero size

**Step 4: Run lint**

Run: `npm run lint`
Expected: No errors

**Step 5: Final commit if any cleanup needed, then close remaining issues**

```bash
gh issue close 160 -c "Implemented: sitemap.xml generated at build time via Vite plugin"
gh issue close 161 -c "Implemented: rss.xml generated at build time via Vite plugin"
gh issue close 154 -c "Audited: netlify.toml has SPA redirect, Node 20 pinned, build config verified"
gh issue close 155 -c "Fixed: siteUrl set to https://shortpaws.netlify.app in settings.json"
gh issue close 156 -c "Implemented: tag filter accessibility, clear filters button on empty state"
```
