# Remaining Issues Completion Design

**Date:** 2026-03-05
**Scope:** Issues #165, #166, #170, #171, #172, #174
**Branch:** Single feature branch for all 6 issues

## 1. Markdown Editor Preview (#165)

Add a toggle button ("Edit" / "Preview") above the content textarea in `src/components/admin/PostEditor.tsx`. Preview renders markdown using existing `renderMarkdown()` from `src/utils/markdown.ts` with DOMPurify sanitization, displayed in a div with Tailwind's `prose` class. Textarea and preview share the same height. No new dependencies.

## 2. Netlify Large Media (#166)

- Configure Git LFS via `netlify lm:setup` (creates `.lfsconfig`)
- `git lfs track "*.jpg" "*.jpeg" "*.png" "*.gif" "*.webp" "*.avif"`
- Add `.gitattributes` with LFS patterns
- Document upload flow: add images to `public/images/`, stored via LFS
- Add helper text in PostEditor cover image field explaining path convention

## 3. Featured Post Pinning (#170)

- Add `featured?: boolean` to `Post` interface in `src/types/post.ts`
- Add "Featured" checkbox in `PostEditor.tsx`
- Add `featured` to frontmatter parsing in `src/content/posts/index.ts`
- In `Blog.tsx`, sort featured posts to top, show star icon indicator (Lucide `Star`)

## 4. RSS + Social Sharing Polish (#171)

- Add `<link rel="alternate" type="application/rss+xml" href="/rss.xml">` in App.tsx Helmet
- Add RSS icon link in nav/footer (Lucide `Rss` icon)
- Share buttons already consistent across pages (verified)

## 5. Security Headers + CSP (#172)

Add to `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://images.unsplash.com data:; font-src 'self'; connect-src 'self'"
```

## 6. Performance: LCP Preload + Formats (#174)

- Add `<link rel="preload">` for Home page hero image via Helmet
- Audit and add explicit `width`/`height` on all `<img>` tags missing them
- Use Unsplash `&fm=webp` parameter for WebP format (no local conversion needed)

## Out of Scope

- Markdown formatting toolbar (YAGNI)
- Local image conversion pipeline
- Advanced image CDN setup
