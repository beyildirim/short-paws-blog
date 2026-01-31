import { useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, User as UserIcon, Mail, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { iconMap } from '../store/blogStore';
import { useCommentStore } from '../store/commentStore';
import { useSettingsStore } from '../store/settingsStore';
import { SocialShare } from '../components/SocialShare';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MarkdownContent } from '../components/MarkdownContent';
import { ReadingProgress } from '../components/ReadingProgress';
import { AuthorCard } from '../components/AuthorCard';
import { usePosts, getAdjacentPosts, getRelatedPosts } from '../hooks/usePosts';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { formatDate, formatRelativeTime, getCurrentUrl } from '../utils/helpers';
import { ROUTES } from '../constants';

function BlogPost() {
  const { postId } = useParams();
  const posts = usePosts();
  const { addComment, getCommentsByPostId } = useCommentStore();
  const { settings } = useSettingsStore();
  const articleRef = useRef<HTMLElement>(null);
  const progress = useReadingProgress(articleRef);

  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentStatus, setCommentStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const post = posts.find((p) => p.id === postId);
  const comments = postId ? getCommentsByPostId(postId) : [];

  const { previous, next } = useMemo(() => {
    if (!post) return { previous: null, next: null };
    return getAdjacentPosts(posts, post.id);
  }, [posts, post]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return getRelatedPosts(posts, post, 3);
  }, [posts, post]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentStatus(null);

    if (!postId) return;

    const result = addComment(postId, commentAuthor, commentEmail, commentContent);
    setCommentStatus({ message: result.message, isError: !result.success });

    if (result.success) {
      setCommentAuthor('');
      setCommentEmail('');
      setCommentContent('');

      // Clear success message after 3 seconds
      setTimeout(() => setCommentStatus(null), 3000);
    }
  };

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | {settings.title}</title>
        </Helmet>
        <div className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Post not found</h2>
          <Link
            to={ROUTES.BLOG}
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <ChevronLeft size={16} className="mr-1" aria-hidden="true" />
            Back to Blog
          </Link>
        </div>
      </>
    );
  }

  const IconComponent = iconMap[post.icon];
  const canonicalUrl = getCurrentUrl();
  const ogImage = post.coverImage || settings.content.home.profileImage;
  const authorName = post.author || 'Gizmeli Kedi';
  const authorRole = settings.content.home.jobTitle;
  const authorBio = settings.content.home.bio;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    image: ogImage ? [ogImage] : undefined,
    mainEntityOfPage: canonicalUrl,
  };

  return (
    <>
      <ReadingProgress progress={progress} />
      <Helmet>
        <title>{post.title} | {settings.title}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="article:published_time" content={post.publishedAt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="space-y-8">
        <Breadcrumbs />
        <article ref={articleRef} className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg">
          <Link
            to={ROUTES.BLOG}
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-6 hover:underline"
          >
            <ChevronLeft size={16} className="mr-1" aria-hidden="true" />
            Back to Blog
          </Link>

          {post.coverImage && (
            <div className="mb-6 overflow-hidden rounded-lg border-2 border-purple-200">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-pink-50 p-4 rounded-full">
              <IconComponent className="text-purple-500" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-purple-600">{post.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={16} aria-hidden="true" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} aria-hidden="true" />
              {post.readTime}
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-purple-50 border border-purple-200 rounded-full text-purple-700">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mb-8">
            <SocialShare title={post.title} description={post.excerpt} url={canonicalUrl} />
          </div>

          <MarkdownContent content={post.content} />

          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <SocialShare title={post.title} description={post.excerpt} url={canonicalUrl} />
          </div>
        </article>

        <AuthorCard
          name={authorName}
          role={authorRole}
          bio={authorBio}
          image={settings.content.home.profileImage}
          email={settings.content.contact.email}
        />

        {(previous || next) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previous && (
              <Link
                to={`/blog/${previous.id}`}
                className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors"
              >
                <span className="text-xs text-gray-500">Previous</span>
                <div className="text-purple-600 font-semibold flex items-center gap-2">
                  <ChevronLeft size={16} aria-hidden="true" />
                  {previous.title}
                </div>
              </Link>
            )}
            {next && (
              <Link
                to={`/blog/${next.id}`}
                className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors text-right"
              >
                <span className="text-xs text-gray-500">Next</span>
                <div className="text-purple-600 font-semibold flex items-center justify-end gap-2">
                  {next.title}
                  <ChevronRight size={16} aria-hidden="true" />
                </div>
              </Link>
            )}
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div className="bg-white border-2 border-purple-200 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.id}`}
                  className="p-4 border border-purple-100 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <h4 className="font-semibold text-purple-700 mb-2">{related.title}</h4>
                  <p className="text-sm text-gray-600">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-pink-100 border-4 border-purple-400 rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">Comments ({comments.length})</h3>
          <p className="text-gray-700 mb-6">
            Share your thoughts on this article!
          </p>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 bg-white p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="comment-author" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="comment-author"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
                    required
                    maxLength={100}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="comment-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    id="comment-email"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-1">
                Comment *
              </label>
              <textarea
                id="comment-content"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full p-4 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
                rows={4}
                placeholder="Share your thoughts..."
                required
                minLength={10}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {commentContent.length}/1000 characters
              </p>
            </div>
            {commentStatus && (
              <div className={`mb-4 p-3 rounded-lg ${commentStatus.isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {commentStatus.message}
              </div>
            )}
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white p-6 rounded-lg border-2 border-purple-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-purple-600">{comment.author}</h4>
                      <p className="text-sm text-gray-500">{formatRelativeTime(comment.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg">
              <p className="text-gray-500">No comments yet. Be the first to share your thoughts! 🐱</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BlogPost;
