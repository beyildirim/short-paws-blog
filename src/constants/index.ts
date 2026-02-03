// Animation durations (in seconds)
export const ANIMATION_DURATION = {
  SPIN_SLOW: 25,
  SPIN_MEDIUM: 20,
  SPIN_FAST: 15,
  SPIN_VERY_FAST: 18,
  MARQUEE: 20,
  TRANSITION: 0.3,
} as const;

// Size constants
export const ICON_SIZE = {
  SMALL: 16,
  MEDIUM: 20,
  LARGE: 24,
  XLARGE: 32,
  DECORATION: 48,
} as const;

// Admin credentials
export const ADMIN_USERNAME = 'admin';

// Color constants
export const DEFAULT_COLORS = {
  PRIMARY: '#9333ea',
  SECONDARY: '#ec4899',
  ACCENT: '#fde047',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  BLOG_POST: '/blog/:postId',
  CONTACT: '/contact',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: 'settings-storage',
  AUTH: 'auth-storage',
  BLOG: 'blog-storage',
  NEWSLETTER: 'newsletter-storage',
  COMMENTS: 'comments-storage',
  BOOKMARKS: 'bookmarks-storage',
  VIEWS: 'views-storage',
} as const;

// Social share URLs
export const SOCIAL_SHARE = {
  TWITTER: (url: string, text: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  LINKEDIN: (url: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  FACEBOOK: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
} as const;
