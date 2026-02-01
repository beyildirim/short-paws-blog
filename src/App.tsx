import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Cat, Stars, Sparkles, Flower, Flower2, BookOpen, Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingsStore } from './store/settingsStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MobileNav } from './components/MobileNav';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PageSkeleton } from './components/PageSkeleton';
import { Analytics } from './components/Analytics';
import { getEnvBoolean } from './utils/env';
import { ROUTES, ICON_SIZE, ANIMATION_DURATION } from './constants';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { settings } = useSettingsStore();
  const adminEnabled = getEnvBoolean('VITE_ENABLE_ADMIN') || getEnvBoolean('DEV');

  // Convert hex colors to RGB for CSS variables
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const primaryRgb = hexToRgb(settings.theme.primaryColor);
  const secondaryRgb = hexToRgb(settings.theme.secondaryColor);
  const accentRgb = hexToRgb(settings.theme.accentColor);

  return (
    <ErrorBoundary>
      <Router>
        <Analytics />
        <Helmet>
          <title>{settings.title}</title>
          <meta name="description" content={settings.description} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            {`
              :root {
                --color-primary: ${primaryRgb ? `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}` : '147, 51, 234'};
                --color-secondary: ${secondaryRgb ? `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}` : '236, 72, 153'};
                --color-accent: ${accentRgb ? `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}` : '253, 224, 71'};
              }
            `}
          </style>
        </Helmet>
        
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white focus:text-purple-700 focus:px-4 focus:py-2 focus:rounded focus:shadow"
        >
          Skip to content
        </a>
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto">
              <PageSkeleton />
            </div>
          }
        >
          <Routes>
        <Route
          path="/*"
          element={
            <div className={`min-h-screen bg-purple-200 p-4 font-${settings.theme.fontFamily.toLowerCase()}`}>
              {/* Mobile Navigation */}
              <MobileNav />
              
              {/* Flower decorations */}
              <div className="fixed top-0 left-0 w-24 h-24 transform -rotate-12 pointer-events-none">
                <Flower2 className="w-full h-full text-[rgb(var(--color-secondary))]" style={{ animation: `spin ${ANIMATION_DURATION.SPIN_MEDIUM}s linear infinite` }} />
              </div>
              <div className="fixed top-0 right-0 w-24 h-24 transform rotate-12 pointer-events-none">
                <Flower className="w-full h-full text-[rgb(var(--color-primary))]" style={{ animation: `spin ${ANIMATION_DURATION.SPIN_FAST}s linear infinite` }} />
              </div>
              <div className="fixed bottom-0 left-0 w-24 h-24 transform rotate-45 pointer-events-none">
                <Flower2 className="w-12 h-12 text-[rgb(var(--color-accent))]" style={{ animation: `spin ${ANIMATION_DURATION.SPIN_SLOW}s linear infinite` }} />
              </div>
              <div className="fixed bottom-0 right-0 w-24 h-24 transform -rotate-45 pointer-events-none">
                <Flower className="w-12 h-12 text-[rgb(var(--color-secondary))]" style={{ animation: `spin ${ANIMATION_DURATION.SPIN_VERY_FAST}s linear infinite` }} />
              </div>

              {/* Navigation - Desktop */}
              <nav className={`hidden md:block bg-white ${settings.theme.borderStyle} border-[rgb(var(--color-secondary))] rounded-lg p-4 mb-8 shadow-lg relative overflow-hidden`} aria-label="Main navigation">
                <div className="flex justify-center items-center gap-8">
                  <Link to={ROUTES.HOME} className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                    <Cat className="inline-block mr-2" size={ICON_SIZE.LARGE} aria-hidden="true" />
                    <span>Home</span>
                  </Link>
                  <Link to={ROUTES.ABOUT} className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                    <Stars className="inline-block mr-2" size={ICON_SIZE.LARGE} aria-hidden="true" />
                    <span>About</span>
                  </Link>
                  <Link to={ROUTES.BLOG} className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                    <BookOpen className="inline-block mr-2" size={ICON_SIZE.LARGE} aria-hidden="true" />
                    <span>Blog</span>
                  </Link>
                  <Link to={ROUTES.CONTACT} className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                    <Sparkles className="inline-block mr-2" size={ICON_SIZE.LARGE} aria-hidden="true" />
                    <span>Contact</span>
                  </Link>
                  {adminEnabled && (
                    <Link to={ROUTES.ADMIN_LOGIN} className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                      <Lock className="inline-block mr-2" size={ICON_SIZE.LARGE} aria-hidden="true" />
                      <span>Admin</span>
                    </Link>
                  )}
                </div>
              </nav>

              {/* Main content */}
              <main id="main-content" className="max-w-4xl mx-auto">
                <Routes>
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.ABOUT} element={<About />} />
                  <Route path={ROUTES.CONTACT} element={<Contact />} />
                  <Route path={ROUTES.BLOG} element={<Blog />} />
                  <Route path={ROUTES.BLOG_POST} element={<BlogPost />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          }
        />
        {adminEnabled ? (
          <>
            <Route path={ROUTES.ADMIN_LOGIN} element={<Login />} />
            <Route
              path={ROUTES.ADMIN}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </>
        ) : (
          <>
            <Route path={ROUTES.ADMIN_LOGIN} element={<NotFound />} />
            <Route path={ROUTES.ADMIN} element={<NotFound />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
