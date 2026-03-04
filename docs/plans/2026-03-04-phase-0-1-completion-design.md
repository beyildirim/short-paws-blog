# Phase 0-1 Completion Design

**Date:** 2026-03-04
**Scope:** Issues #154, #155, #156, #160, #161
**Also:** Verify and close already-done issues #157, #158, #159

## 1. Static Feeds Vite Plugin (#160, #161)

**File:** `vite-plugins/static-feeds.ts`

Single Vite plugin that generates three files into `dist/` during the `closeBundle` hook:

### sitemap.xml
- Static routes: `/`, `/about`, `/blog`, `/contact`
- Dynamic routes: `/blog/{slug}` for each published post
- `<lastmod>` from post dates; `<changefreq>` weekly for posts, monthly for pages
- Base URL: `https://shortpaws.netlify.app`

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://shortpaws.netlify.app/sitemap.xml
```

### rss.xml (RSS 2.0)
- Channel metadata from `src/data/settings.json` (title, description)
- Items: each published post with title, link, excerpt, pubDate, guid
- Link: `https://shortpaws.netlify.app`

### Implementation details
- Scan `src/content/posts/*.md` and parse YAML frontmatter with `js-yaml`
- Filter to `status: published` only (exclude drafts and future-scheduled)
- No new dependencies needed
- Register plugin in `vite.config.ts`

## 2. Settings Seed Verification (#155)

- Set `seo.siteUrl` to `"https://shortpaws.netlify.app"` in `src/data/settings.json`
- Verify `settingsStore.ts` merge logic handles new defaults without clobbering localStorage overrides
- Add inline comment documenting how to edit defaults

## 3. Deploy Parity Audit (#154)

- Create `netlify.toml` if missing:
  - Build command: `npm run build`
  - Publish dir: `dist`
  - Node version pinned to match local
  - SPA redirect: `/* /index.html 200`
- Verify Tailwind v4 CSS pipeline produces correct output in production build
- Document required env vars (only `CODECOV_TOKEN`, optional)

## 4. Search UX Polish (#156)

### Debounced search
- Add `useDebounce` hook (300ms) applied to search input in `BlogSearch`
- Prevents re-filtering on every keystroke

### Tag filter accessibility
- `aria-pressed` on tag filter buttons
- `role="group"` + `aria-label="Filter by tag"` on tag container
- Visible focus indicators

### Empty state
- Cat-themed friendly message when search/filter returns no results
- "Clear filters" action button

## 5. Already-Done Issues (Verify & Close)

- **#157** (related posts + prev/next): Already in `BlogPost.tsx` — verify acceptance criteria met
- **#158** (SEO meta + OG/Twitter): Already has OG, Twitter cards, canonical — verify per-route coverage
- **#159** (JSON-LD): Already has BlogPosting schema — verify required fields present

## Out of Scope

- Admin routes excluded from sitemap
- No SSR/prerendering
- No new npm dependencies
- Phase 2+ issues
