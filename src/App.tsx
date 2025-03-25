import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Cat, Stars, Sparkles, Flower, Flower2, BookOpen, Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingsStore } from './store/settingsStore';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { settings } = useSettingsStore();

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
    <Router>
      <Helmet>
        <title>{settings.title}</title>
        <meta name="description" content={settings.description} />
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
      <Routes>
        <Route
          path="/*"
          element={
            <div className={`min-h-screen bg-purple-200 p-4 font-${settings.theme.fontFamily.toLowerCase()}`}>
              {/* Flower decorations */}
              <div className="fixed top-0 left-0 w-24 h-24 transform -rotate-12">
                <Flower2 className="w-full h-full text-[rgb(var(--color-secondary))] animate-[spin_20s_linear_infinite]" />
              </div>
              <div className="fixed top-0 right-0 w-24 h-24 transform rotate-12">
                <Flower className="w-full h-full text-[rgb(var(--color-primary))] animate-[spin_15s_linear_infinite]" />
              </div>
              <div className="fixed bottom-0 left-0 w-24 h-24 transform rotate-45">
                <Flower2 className="w-12 h-12 text-[rgb(var(--color-accent))] animate-[spin_25s_linear_infinite]" />
              </div>
              <div className="fixed bottom-0 right-0 w-24 h-24 transform -rotate-45">
                <Flower className="w-12 h-12 text-[rgb(var(--color-secondary))] animate-[spin_18s_linear_infinite]" />
              </div>

              {/* Navigation */}
              <nav className={`bg-white ${settings.theme.borderStyle} border-[rgb(var(--color-secondary))] rounded-lg p-4 mb-8 shadow-lg relative overflow-hidden`}>
                <div className="flex justify-center items-center gap-8">
                  <Link to="/" className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                    <Cat className="inline-block mr-2" size={24} />
                    Home
                  </Link>
                  <Link to="/about" className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                    <Stars className="inline-block mr-2" size={24} />
                    About
                  </Link>
                  <Link to="/blog" className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                    <BookOpen className="inline-block mr-2" size={24} />
                    Blog
                  </Link>
                  <Link to="/contact" className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                    <Sparkles className="inline-block mr-2" size={24} />
                    Contact
                  </Link>
                  <Link to="/admin/login" className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] font-bold text-lg transition-colors duration-300">
                    <Lock className="inline-block mr-2" size={24} />
                    Admin
                  </Link>
                </div>
              </nav>

              {/* Main content */}
              <div className="max-w-4xl mx-auto">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:postId" element={<BlogPost />} />
                </Routes>
              </div>
            </div>
          }
        />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;