import { Link } from 'react-router-dom';
import { Cat, Home, Search, Frown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Gizmeli Kedi</title>
        <meta name="description" content="Oops! This page doesn't exist." />
      </Helmet>
      
      <div className="min-h-screen bg-purple-200 flex items-center justify-center p-4">
        <div className="bg-white border-4 border-pink-500 rounded-lg p-8 max-w-md w-full shadow-lg relative">
          {/* Decorative cats */}
          <div className="absolute -top-8 -left-8 animate-bounce">
            <Cat className="text-purple-500" size={48} />
          </div>
          <div className="absolute -top-8 -right-8 animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Cat className="text-pink-500" size={48} />
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Frown className="text-purple-600" size={80} />
            </div>
            
            <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-pink-500 mb-4">
              This Cat Got Lost!
            </h2>
            <p className="text-gray-700 mb-8">
              Looks like this page wandered off somewhere... Even cats with nine lives can't find it! 🐱
            </p>
            
            <div className="space-y-3">
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300"
              >
                <Home size={20} />
                Go Home
              </Link>
              
              <Link
                to="/blog"
                className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300"
              >
                <Search size={20} />
                Browse Blog
              </Link>
            </div>
            
            <p className="mt-8 text-sm text-gray-500">
              Lost? Try using the navigation menu above! ✨
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
