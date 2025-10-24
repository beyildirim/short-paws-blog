import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cat, Stars, BookOpen, Sparkles, Lock } from 'lucide-react';
import { ROUTES } from '../constants';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { to: ROUTES.HOME, icon: Cat, label: 'Home' },
    { to: ROUTES.ABOUT, icon: Stars, label: 'About' },
    { to: ROUTES.BLOG, icon: BookOpen, label: 'Blog' },
    { to: ROUTES.CONTACT, icon: Sparkles, label: 'Contact' },
    { to: ROUTES.ADMIN_LOGIN, icon: Lock, label: 'Admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg border-2 border-purple-500"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="text-purple-600" size={24} />
        ) : (
          <Menu className="text-purple-600" size={24} />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <nav
        className={`
          md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          border-l-4 border-pink-500
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full pt-20 p-6">
          <div className="space-y-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                  ${isActive(to)
                    ? 'bg-purple-100 text-purple-600 font-bold'
                    : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                  }
                `}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Gizmeli Kedi's Blog 🐱
            </p>
          </div>
        </div>
      </nav>
    </>
  );
}
