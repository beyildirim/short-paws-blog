import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '../utils/helpers';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function BlogSearch({ onSearch, placeholder = 'Search blog posts...' }: BlogSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search to avoid excessive re-renders
  const debouncedSearch = debounce((searchQuery: string) => {
    onSearch(searchQuery);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div
        className={`
          relative flex items-center border-2 rounded-lg transition-all duration-300
          ${isFocused 
            ? 'border-purple-500 shadow-md' 
            : 'border-purple-300 hover:border-purple-400'
          }
        `}
      >
        <Search 
          className="absolute left-3 text-gray-400" 
          size={20} 
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none"
          aria-label="Search blog posts"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {query && (
        <p className="mt-2 text-sm text-gray-600">
          Searching for: <span className="font-medium text-purple-600">{query}</span>
        </p>
      )}
    </div>
  );
}
