# 🐱 Short Paws Blog

[![CodeQL](https://github.com/beyildirim/short-paws-blog/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/beyildirim/short-paws-blog/actions/workflows/github-code-scanning/codeql)
[![Dependabot Updates](https://github.com/beyildirim/short-paws-blog/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/beyildirim/short-paws-blog/actions/workflows/dependabot/dependabot-updates)

A modern, playful personal blog/portfolio website for Gizmeli Kedi - Planning Specialist extraordinaire! Built with a delightful 90s-inspired aesthetic and modern web technologies.

## ✨ Features

### 🎨 **Design & UX**
- Responsive design that works beautifully on mobile, tablet, and desktop
- Mobile-first hamburger navigation menu
- Playful animated flower decorations
- Custom cat-themed cursor (desktop only)
- Color-customizable theme system
- Print-optimized stylesheets for blog posts

### 📝 **Blog Functionality**
- Full blog with individual post pages
- Search and filter blog posts
- Tag-based filtering and related posts
- Social sharing buttons (Twitter, LinkedIn, Facebook, Copy Link)
- Comment system with validation
- Newsletter subscription
- Markdown-based posts in `src/content/posts`
- Reading progress indicator and prev/next navigation
- SEO-optimized with meta tags and Open Graph support

### 🔐 **Admin Dashboard**
- Protected admin routes with authentication
- Manage blog posts (create, edit, delete)
- Customize theme colors and fonts
- Edit page content dynamically
- Secure password hashing (PBKDF2 + salt)
- Rate limiting on forms

### ♿ **Accessibility & Performance**
- ARIA labels and semantic HTML
- Keyboard navigation support
- Error boundaries for graceful error handling
- Code splitting with React.lazy for optimal loading
- Loading states and skeletons
- Breadcrumb navigation
- Custom 404 page
- JSON-LD structured data for SEO

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v7
- **State Management:** Zustand with persistence
- **SEO:** React Helmet Async
- **Icons:** Lucide React
- **Testing:** Jest with React Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/short-paws-blog.git

# Navigate to project directory
cd short-paws-blog

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🔑 Admin Access

On first visit to `/admin/login`, you’ll be prompted to set an admin password.
After setup:
- Username: `admin`
- Password: the one you set

> ⚠️ **Note:** Admin authentication is client-side for this demo. For production use, move auth and data storage to a backend.
> Admin routes are hidden in production unless `VITE_ENABLE_ADMIN=true` is set.

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Breadcrumbs.tsx
│   ├── BlogSearch.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── MobileNav.tsx
│   ├── ProtectedRoute.tsx
│   └── SocialShare.tsx
├── constants/           # App-wide constants
│   └── index.ts
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── About.tsx
│   ├── Blog.tsx
│   ├── BlogPost.tsx
│   ├── Contact.tsx
│   ├── Home.tsx
│   └── NotFound.tsx
├── store/              # Zustand state stores
│   ├── authStore.ts
│   ├── blogStore.ts
│   ├── commentStore.ts
│   ├── newsletterStore.ts
│   └── settingsStore.ts
├── utils/              # Utility functions
│   ├── crypto.ts       # Password hashing & security
│   └── helpers.ts      # General helpers
├── App.tsx             # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🎨 Customization

### Content Authoring (Markdown)
Blog posts live in `src/content/posts/*.md` with frontmatter. Example:

```md
---
title: "My Post"
slug: "my-post"
excerpt: "Short summary..."
date: "2024-03-15"
status: "published" # draft | scheduled | published
tags: ["strategy", "planning"]
coverImage: "https://..."
---
Your markdown content here...
```

Run content linting:

```bash
npm run lint:content
```

### Environment Variables

Create a `.env` file (optional):

```
VITE_ENABLE_ADMIN=true
VITE_PLAUSIBLE_DOMAIN=yourdomain.com
VITE_PLAUSIBLE_SRC=https://plausible.io/js/script.js
VITE_NEWSLETTER_ENDPOINT=https://your-newsletter-provider/subscribe
```

### Security Headers (Recommended)
If you control deployment headers, consider a basic CSP:

```
Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; script-src 'self' https://plausible.io; style-src 'self' 'unsafe-inline'; font-src 'self' https: data:
```

### Theme Colors
Navigate to **Admin → Theme** to customize:
- Primary Color (default: Purple)
- Secondary Color (default: Pink)
- Accent Color (default: Yellow)
- Font Family (Comic, Sans Serif, Serif)
- Border Style (Thick, Medium, Thin)

### Content Management
Update page content via **Admin → Pages**:
- Home page welcome text and bio
- About page professional journey
- Contact information

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📄 License

This project is private and proprietary.

## 💝 Made with Love

Created for Gizmeli Kedi, the purr-fect Planning Specialist! 🐱✨

---

**Note:** This is a personal portfolio/blog website. The playful design and cat theme are intentional features! 🎉
