# Remaining Issues Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete all remaining open issues (#165, #166, #170, #171, #172, #174) in a single feature branch.

**Architecture:** Markdown preview via existing renderMarkdown pipeline. Featured posts via boolean flag in Post type. Security headers via netlify.toml. Performance via Unsplash query params and preload links. Netlify Large Media via Git LFS config.

**Tech Stack:** React, TypeScript, Tailwind, Vite, Netlify, Git LFS

---

### Task 1: Featured Post — Add to Post Type and Frontmatter Parser

**Files:**
- Modify: `src/types/post.ts` (line 3-17)
- Modify: `src/content/posts/index.ts` (lines 5-17, 66-80)

**Step 1: Add `featured` to Post interface**

In `src/types/post.ts`, add `featured?: boolean` after line 15 (`readTime`):

```typescript
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
  featured?: boolean;
  source: 'content' | 'local';
}
```

**Step 2: Add `featured` to Frontmatter interface and buildContentPosts**

In `src/content/posts/index.ts`, add `featured?: boolean` to the Frontmatter interface (after line 16):

```typescript
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
  featured?: boolean;
}
```

In `buildContentPosts`, add `featured` to the returned object (after line 77, `author`):

```typescript
        featured: frontmatter.featured || false,
```

**Step 3: Run tests**

Run: `npm test -- src/__tests__/contentPosts.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add src/types/post.ts src/content/posts/index.ts
git commit -m "feat: add featured field to Post type and frontmatter parser (#170)"
```

---

### Task 2: Featured Post — Blog Listing Sort + Visual Indicator

**Files:**
- Modify: `src/pages/Blog.tsx` (lines 43-46, 124-187)

**Step 1: Sort featured posts to top**

In `src/pages/Blog.tsx`, update the `visiblePosts` memo (lines 43-46) to sort featured first:

```typescript
  const visiblePosts = useMemo(() => {
    const filtered = activeTag
      ? filteredPosts.filter((post) => post.tags.includes(activeTag))
      : filteredPosts;
    return [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [filteredPosts, activeTag]);
```

**Step 2: Add Star icon import and visual indicator**

Add `Star` to the lucide-react import at line 2:

```typescript
import { Calendar, Clock, ChevronRight, BookOpen, Star } from 'lucide-react';
```

In the post card (around line 149), add a featured indicator after the title:

```tsx
<h3 className="text-xl font-bold text-purple-600 mb-2">
  {post.featured && (
    <Star className="inline-block mr-1 text-yellow-500 fill-yellow-500" size={18} aria-label="Featured post" />
  )}
  {post.title}
</h3>
```

**Step 3: Run tests**

Run: `npm test -- src/__tests__/pages.test.tsx src/__tests__/Blog.test.tsx`
Expected: PASS

**Step 4: Commit**

```bash
git add src/pages/Blog.tsx
git commit -m "feat: sort featured posts to top with star indicator (#170)"
```

---

### Task 3: Featured Post — Admin Checkbox

**Files:**
- Modify: `src/components/admin/PostEditor.tsx` (lines 5-14, 71-77)

**Step 1: Add `featured` to PostEditorFormData**

In `src/components/admin/PostEditor.tsx`, add `featured` to the interface (after line 13, `coverImage`):

```typescript
interface PostEditorFormData {
    title: string;
    excerpt: string;
    content: string;
    icon: IconName;
    tags: string;
    status: string;
    publishedAt: string;
    coverImage: string;
    featured: boolean;
}
```

**Step 2: Add checkbox after cover image field**

After the cover image FormInput (line 77), add:

```tsx
<label className="flex items-center gap-2 text-sm text-gray-700">
    <input
        type="checkbox"
        checked={formData.featured}
        onChange={(e) => handleChange('featured', e.target.checked)}
        className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
    />
    Featured post (pinned to top of blog listing)
</label>
```

**Step 3: Update Dashboard to include `featured` in formData**

Check `src/pages/admin/Dashboard.tsx` — wherever `PostEditorFormData` is initialized or reset, add `featured: false` (or `featured: post.featured ?? false` for editing).

**Step 4: Run tests**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/admin/PostEditor.tsx src/pages/admin/Dashboard.tsx
git commit -m "feat: add featured post checkbox to admin editor (#170)"
```

---

### Task 4: Markdown Editor Preview Toggle (#165)

**Files:**
- Modify: `src/components/admin/PostEditor.tsx` (lines 84-89)

**Step 1: Add state and imports**

Add `useState` import and `renderMarkdown` import at top of PostEditor.tsx:

```typescript
import { useState } from 'react';
import { Save, Eye, Edit3 } from 'lucide-react';
import type { IconName } from '../../store/blogStore';
import { FormInput, FormTextarea, FormSelect } from '../forms';
import { renderMarkdown } from '../../utils/markdown';
```

Add state inside the component function (after line 36):

```typescript
const [showPreview, setShowPreview] = useState(false);
```

**Step 2: Replace content textarea with toggle + preview**

Replace the content FormTextarea (lines 84-89) with:

```tsx
<div>
    <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Content</span>
        <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
        >
            {showPreview ? (
                <><Edit3 size={14} /> Edit</>
            ) : (
                <><Eye size={14} /> Preview</>
            )}
        </button>
    </div>
    {showPreview ? (
        <div
            className="prose prose-purple max-w-none p-4 border-2 border-purple-200 rounded-lg bg-white min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content) }}
        />
    ) : (
        <FormTextarea
            placeholder="Content (markdown supported)"
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={10}
        />
    )}
</div>
```

**Step 3: Run tests**

Run: `npm test`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/admin/PostEditor.tsx
git commit -m "feat: add markdown preview toggle to post editor (#165)"
```

---

### Task 5: RSS Link in Head + Nav Icon (#171)

**Files:**
- Modify: `src/App.tsx` (lines 3, 46-59, 98-121)
- Modify: `src/components/MobileNav.tsx` (lines 3, 15-20)

**Step 1: Add RSS link tag in Helmet**

In `src/App.tsx`, add inside the `<Helmet>` block (after line 48, the description meta):

```tsx
<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />
```

**Step 2: Add RSS icon to desktop nav**

Add `Rss` to the lucide-react import at line 3:

```typescript
import { Cat, Stars, Sparkles, Flower, Flower2, BookOpen, Lock, Rss } from 'lucide-react';
```

In the desktop nav (after the Contact link, around line 114, before the admin conditional), add:

```tsx
<a
  href="/rss.xml"
  className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300"
  aria-label="RSS Feed"
>
  <Rss className="inline-block" size={ICON_SIZE.LARGE} aria-hidden="true" />
</a>
```

**Step 3: Add RSS to mobile nav**

In `src/components/MobileNav.tsx`, add `Rss` to the import (line 3):

```typescript
import { Menu, X, Cat, Stars, BookOpen, Sparkles, Lock, Rss } from 'lucide-react';
```

After the navItems array (after line 23), add an RSS link in the mobile nav footer (around line 83):

Replace the footer div (lines 83-87) with:

```tsx
<div className="mt-auto pt-6 border-t border-gray-200">
    <a
      href="/rss.xml"
      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors"
      aria-label="RSS Feed"
    >
      <Rss size={16} />
      <span className="text-sm">RSS Feed</span>
    </a>
    <p className="text-xs text-center text-gray-500 mt-2">
      Gizmeli Kedi's Blog 🐱
    </p>
</div>
```

**Step 4: Run tests**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/App.tsx src/components/MobileNav.tsx
git commit -m "feat: add RSS link in head and nav icons (#171)"
```

---

### Task 6: Security Headers + CSP (#172)

**Files:**
- Modify: `netlify.toml`

**Step 1: Add security headers to netlify.toml**

Append to the existing `netlify.toml`:

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

**Step 2: Commit**

```bash
git add netlify.toml
git commit -m "feat: add security headers and CSP baseline (#172)"
```

---

### Task 7: Performance — LCP Preload + Image Dimensions (#174)

**Files:**
- Modify: `src/pages/Home.tsx` (lines 12-17)

**Step 1: Add preload link for hero image**

In `src/pages/Home.tsx`, add a preload link inside the Helmet block (after line 16):

```tsx
<Helmet>
    <title>{settings.title}</title>
    <meta name="description" content={settings.description} />
    <meta property="og:title" content={settings.title} />
    <meta property="og:description" content={settings.description} />
    <link
      rel="preload"
      as="image"
      href={settings.content.home.profileImage}
    />
</Helmet>
```

**Step 2: Use WebP format for Unsplash images**

The profile image URL is `https://images.unsplash.com/photo-...?w=400&h=400&fit=crop`. Unsplash supports `&fm=webp` to serve WebP. Update the ResponsiveImage src to append the format parameter.

In the profile image section (line 48), check if the URL contains `unsplash.com` and append `&fm=webp`:

This is a runtime concern — the simplest approach is to do it where the image is rendered. In Home.tsx (line 48):

```tsx
<ResponsiveImage
    src={settings.content.home.profileImage + (settings.content.home.profileImage.includes('unsplash.com') ? '&fm=webp' : '')}
    alt="Profile"
    className={`w-48 h-48 rounded-full ${settings.theme.borderStyle} border-[rgb(var(--color-secondary))] object-cover animate-float`}
    loading="eager"
    width={192}
    height={192}
/>
```

**Step 3: Run tests**

Run: `npm test`
Expected: PASS

**Step 4: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: add LCP preload and WebP format for hero image (#174)"
```

---

### Task 8: Netlify Large Media Setup (#166)

**Files:**
- Create: `.gitattributes`
- Create: `.lfsconfig` (if not created by CLI)

**Step 1: Check if Git LFS is installed**

Run: `git lfs version`
Expected: Shows git-lfs version. If not installed, run `brew install git-lfs && git lfs install`.

**Step 2: Create `.gitattributes` for LFS tracking**

Create `.gitattributes`:

```
# Netlify Large Media - track binary image files
public/images/**/*.jpg filter=lfs diff=lfs merge=lfs -text
public/images/**/*.jpeg filter=lfs diff=lfs merge=lfs -text
public/images/**/*.png filter=lfs diff=lfs merge=lfs -text
public/images/**/*.gif filter=lfs diff=lfs merge=lfs -text
public/images/**/*.webp filter=lfs diff=lfs merge=lfs -text
public/images/**/*.avif filter=lfs diff=lfs merge=lfs -text
```

**Step 3: Create `public/images/` directory with .gitkeep**

Run: `mkdir -p public/images && touch public/images/.gitkeep`

**Step 4: Add helper text to PostEditor cover image field**

In `src/components/admin/PostEditor.tsx`, update the cover image FormInput placeholder (line 74):

```tsx
<FormInput
    type="url"
    placeholder="Cover image URL or /images/filename.jpg"
    value={formData.coverImage}
    onChange={(e) => handleChange('coverImage', e.target.value)}
/>
```

**Step 5: Commit**

```bash
git add .gitattributes public/images/.gitkeep src/components/admin/PostEditor.tsx
git commit -m "feat: configure Netlify Large Media with Git LFS (#166)"
```

---

### Task 9: Final Integration Test + Close Issues

**Step 1: Run full test suite**

Run: `npm test`
Expected: All tests PASS

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

**Step 4: Close all issues**

```bash
gh issue close 165 -c "Implemented: markdown preview toggle in post editor"
gh issue close 166 -c "Configured: Netlify Large Media with Git LFS for public/images/"
gh issue close 170 -c "Implemented: featured post pinning with star indicator and admin checkbox"
gh issue close 171 -c "Implemented: RSS link in head tag and nav icons"
gh issue close 172 -c "Implemented: security headers and CSP baseline in netlify.toml"
gh issue close 174 -c "Implemented: LCP preload for hero image, WebP format via Unsplash"
```
