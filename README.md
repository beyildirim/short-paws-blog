# 🐱 Short Paws Blog

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
- Social sharing buttons (Twitter, LinkedIn, Facebook, Copy Link)
- Comment system with validation
- Newsletter subscription
- SEO-optimized with meta tags and Open Graph support

### 🔐 **Admin Dashboard**
- Protected admin routes with authentication
- Manage blog posts (create, edit, delete)
- Customize theme colors and fonts
- Edit page content dynamically
- Secure password hashing (SHA-256)
- Rate limiting on forms

### ♿ **Accessibility & Performance**
- ARIA labels and semantic HTML
- Keyboard navigation support
- Error boundaries for graceful error handling
- Code splitting with React.lazy for optimal loading
- Loading states and skeletons
- Breadcrumb navigation
- Custom 404 page

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

**Default Credentials:**
- Username: `admin`
- Password: `REDACTED`

> ⚠️ **Important:** Change the admin password immediately after first login via the Settings tab in the admin dashboard!

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
