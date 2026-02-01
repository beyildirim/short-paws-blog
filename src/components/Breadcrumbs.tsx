import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export function Breadcrumbs() {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Format label
      let label = path.charAt(0).toUpperCase() + path.slice(1);
      label = label.replace(/-/g, ' ');
      
      // Don't add the last segment if it's a post ID (starts with a number or is a long string)
      if (index === paths.length - 1 && (path.match(/^\d/) || path.length > 20)) {
        return;
      }
      
      breadcrumbs.push({ label, path: currentPath });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  // Don't show breadcrumbs on home page or if only one item
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-purple-600 font-medium flex items-center gap-1">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1"
              >
                {index === 0 && <Home size={14} />}
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
