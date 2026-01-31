import { useState, useMemo } from 'react';
import { Calendar, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { iconMap } from '../store/blogStore';
import { useNewsletterStore } from '../store/newsletterStore';
import { useSettingsStore } from '../store/settingsStore';
import { BlogSearch } from '../components/BlogSearch';
import { TagFilter } from '../components/TagFilter';
import { usePosts } from '../hooks/usePosts';
import { formatDate } from '../utils/helpers';


function Blog() {
  const posts = usePosts();
  const { subscribe } = useNewsletterStore();
  const { settings } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts]
  );

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    
    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  const visiblePosts = useMemo(() => {
    if (!activeTag) return filteredPosts;
    return filteredPosts.filter((post) => post.tags.includes(activeTag));
  }, [filteredPosts, activeTag]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await subscribe(email);
    setSubscribeStatus({ message: result.message, isError: !result.success });
    
    if (result.success) {
      setEmail('');
    }
    
    // Clear status after 5 seconds
    setTimeout(() => setSubscribeStatus(null), 5000);
  };

  return (
    <>
      <Helmet>
        <title>Blog | {settings.title}</title>
        <meta name="description" content="Read the latest insights from Gizmeli Kedi on planning, strategy, and professional development" />
      </Helmet>
      
      <div className="space-y-8">
      <div className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center flex items-center justify-center gap-2">
          <BookOpen className="text-pink-500" aria-hidden="true" />
          Gizmeli Kedi's Blog
        </h2>
        
        <div className="mb-6 space-y-4">
          <BlogSearch onSearch={setSearchQuery} />
          <TagFilter tags={tags} activeTag={activeTag} onChange={setActiveTag} />
        </div>

        {visiblePosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-2">No posts found 😿</p>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Showing {visiblePosts.length} {visiblePosts.length === 1 ? 'post' : 'posts'}
            </p>
            <div className="grid gap-6">
              {visiblePosts.map((post) => {
                const IconComponent = iconMap[post.icon];
                return (
              <article 
                key={post.id}
                className="bg-pink-50 rounded-lg p-6 transition-transform duration-300 hover:transform hover:scale-[1.02] border-2 border-purple-200"
              >
                {post.coverImage && (
                  <div className="mb-4 overflow-hidden rounded-lg border-2 border-purple-200">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-md">
                    <IconComponent className="text-purple-500" size={24} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-purple-600 mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} aria-hidden="true" />
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} aria-hidden="true" />
                        {post.readTime}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {post.excerpt}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-white border border-purple-200 rounded-full text-purple-700">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium hover:underline"
                    >
                      Read More
                      <ChevronRight size={16} className="ml-1" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );})}
          </div>
          </>
        )}
      </div>

      <div className="bg-pink-100 border-4 border-purple-400 rounded-lg p-8 shadow-lg text-center">
        <h3 className="text-2xl font-bold text-purple-600 mb-4">Subscribe to My Newsletter</h3>
        <p className="text-gray-700 mb-4">
          Get the latest planning insights and cat wisdom delivered to your inbox!
        </p>
        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-md border-2 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 focus:outline-none"
              required
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
            >
              Subscribe
            </button>
          </div>
          {subscribeStatus && (
            <div className={`mt-4 p-3 rounded-lg ${subscribeStatus.isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {subscribeStatus.message}
            </div>
          )}
        </form>
      </div>
    </div>
    </>
  );
}

export default Blog;
