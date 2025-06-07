import React from 'react';
import { Calendar, Clock, ChevronRight, BookOpen, Boxes, Cat, Brain, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  icon: React.ReactNode;
}

const blogPosts: BlogPost[] = [
  {
    id: "supply-chain-whiskers",
    title: "Supply Chain Management: A Cat's Eye View",
    date: "March 15, 2024",
    readTime: "5 min read",
    excerpt: "How feline intuition and strategic planning come together to create purr-fect supply chain solutions. Discover my unique approach to managing complex logistics.",
    icon: <Boxes className="text-purple-500" size={24} />
  },
  {
    id: "planning-specialist-journey",
    title: "From Curious Cat to Planning Specialist",
    date: "March 10, 2024",
    readTime: "4 min read",
    excerpt: "My journey from being a naturally curious cat to becoming a professional planning specialist. Learn about the skills that make me unique in this field.",
    icon: <Cat className="text-pink-500" size={24} />
  },
  {
    id: "strategic-thinking",
    title: "Strategic Thinking: Combining Instinct with Analytics",
    date: "March 5, 2024",
    readTime: "6 min read",
    excerpt: "How I blend natural feline instincts with data-driven analysis to create comprehensive strategic plans that work.",
    icon: <Brain className="text-blue-500" size={24} />
  },
  {
    id: "client-relationships",
    title: "Building Purr-fect Client Relationships",
    date: "February 28, 2024",
    readTime: "4 min read",
    excerpt: "The art of maintaining strong client relationships while delivering exceptional planning services. A blend of professionalism and personality.",
    icon: <HeartHandshake className="text-green-500" size={24} />
  }
];

function Blog() {
  return (
    <div className="space-y-8">
      <div className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center flex items-center justify-center gap-2">
          <BookOpen className="text-pink-500" />
          Gizmeli Kedi's Blog
        </h2>
        
        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-pink-50 rounded-lg p-6 transition-transform duration-300 transform hover:scale-[1.02] border-2 border-purple-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-md">
                  {post.icon}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-purple-600 mb-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {post.readTime}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Read More
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="bg-pink-100 border-4 border-purple-400 rounded-lg p-8 shadow-lg text-center">
        <h3 className="text-2xl font-bold text-purple-600 mb-4">Subscribe to My Newsletter</h3>
        <p className="text-gray-700 mb-4">
          Get the latest planning insights and cat wisdom delivered to your inbox!
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-md border-2 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
            />
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;