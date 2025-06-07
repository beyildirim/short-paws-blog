import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, Boxes, Cat, Brain, HeartHandshake } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  icon: React.ReactNode;
}

const blogPosts: BlogPost[] = [
  {
    id: "supply-chain-whiskers",
    title: "Supply Chain Management: A Cat's Eye View",
    date: "March 15, 2024",
    readTime: "5 min read",
    excerpt: "How feline intuition and strategic planning come together to create purr-fect supply chain solutions. Discover my unique approach to managing complex logistics.",
    content: `
      As a cat with a keen eye for detail and natural curiosity, I've discovered that supply chain management is surprisingly similar to feline instincts. Just as we cats carefully plan our daily routines, from strategic napping spots to optimal hunting times, successful supply chain management requires careful observation, precise timing, and adaptability.

      My Feline Approach to Supply Chain Management:

      1. Observation and Analysis
      Like a cat perched high on a shelf, I maintain a broad view of the entire supply chain ecosystem. This elevated perspective allows me to:
      - Identify potential bottlenecks before they occur
      - Spot opportunities for optimization
      - Monitor the flow of resources with careful attention

      2. Agile Response
      Cats are known for their quick reflexes and ability to land on their feet. In supply chain management, this translates to:
      - Rapid response to market changes
      - Flexible adaptation to new circumstances
      - Quick implementation of contingency plans

      3. Resource Optimization
      Just as we cats never waste energy in our movements, efficient resource management is crucial in supply chain operations:
      - Streamlined inventory management
      - Optimal route planning
      - Energy-efficient transportation solutions

      4. Risk Management
      Cats are naturally cautious creatures, always aware of their surroundings. This instinct is valuable in supply chain management:
      - Careful vendor evaluation
      - Regular risk assessments
      - Development of backup plans

      The Future of Supply Chain Management:
      As we move forward, the integration of feline intuition with modern technology will continue to shape the future of supply chain management. Machine learning and AI can enhance our natural abilities to predict and respond to changes in the supply chain landscape.

      Remember: Sometimes the best solutions come from unexpected perspectives. Don't be afraid to think outside the litter box! 🐱
    `,
    icon: <Boxes className="text-purple-500" size={24} />
  },
  {
    id: "planning-specialist-journey",
    title: "From Curious Cat to Planning Specialist",
    date: "March 10, 2024",
    readTime: "4 min read",
    excerpt: "My journey from being a naturally curious cat to becoming a professional planning specialist. Learn about the skills that make me unique in this field.",
    content: `
      Every cat has a story, and mine began with an insatiable curiosity about organization and planning. From arranging my toy mice in perfect order to scheduling my daily activities with precision, I knew I was destined for a career in planning.

      The Early Days:
      As a kitten, I showed natural talent for:
      - Organizing my sleeping spots by sunlight exposure
      - Calculating optimal paths through the house
      - Coordinating meal times with household activities

      Educational Journey:
      My formal education in planning included:
      - Advanced Purr-ject Management
      - Strategic Whisker-thinking
      - Tail-end Risk Analysis

      Key Learning Moments:
      1. The importance of flexibility in planning
      2. How to balance multiple stakeholders' needs
      3. The value of both short and long-term perspectives

      Current Role:
      As a Planning Specialist, I now help organizations:
      - Develop comprehensive strategic plans
      - Optimize resource allocation
      - Create efficient workflows
      - Build sustainable processes

      Lessons Learned:
      The most important things I've learned are:
      - Plans should be adaptable like a cat's landing
      - Always land on your feet when challenges arise
      - Keep your whiskers tuned to changes in the environment

      Looking ahead, I continue to combine my feline instincts with professional expertise to create unique solutions for complex planning challenges. After all, who better to plan than a creature with nine lives worth of perspective? 🐱✨
    `,
    icon: <Cat className="text-pink-500" size={24} />
  },
  {
    id: "strategic-thinking",
    title: "Strategic Thinking: Combining Instinct with Analytics",
    date: "March 5, 2024",
    readTime: "6 min read",
    excerpt: "How I blend natural feline instincts with data-driven analysis to create comprehensive strategic plans that work.",
    content: `
      In the world of strategic planning, the combination of natural instinct and analytical thinking creates a powerful approach. As a cat, I bring unique perspectives to the field of strategic planning, blending feline intuition with modern analytical methods.

      The Power of Feline Intuition:
      Cats are known for their:
      - Sharp observational skills
      - Quick decision-making abilities
      - Adaptability to changing situations

      Analytical Framework:
      I complement these natural abilities with:
      - Data-driven decision making
      - Statistical analysis
      - Trend forecasting
      - Risk assessment models

      The Integration Process:
      1. Observation Phase
         - Gather qualitative insights
         - Collect quantitative data
         - Monitor market trends

      2. Analysis Phase
         - Process data through analytical tools
         - Apply intuitive understanding
         - Identify patterns and opportunities

      3. Strategy Development
         - Create comprehensive plans
         - Build in flexibility
         - Establish clear metrics

      4. Implementation
         - Execute with precision
         - Monitor progress
         - Adjust as needed

      Case Studies:
      I've successfully applied this approach to:
      - Supply chain optimization
      - Resource allocation
      - Process improvement
      - Strategic planning

      The future of strategic thinking lies in this balance between instinct and analytics. As we continue to advance technologically, maintaining this connection to our natural intuition becomes even more valuable. 🐱📊
    `,
    icon: <Brain className="text-blue-500" size={24} />
  },
  {
    id: "client-relationships",
    title: "Building Purr-fect Client Relationships",
    date: "February 28, 2024",
    readTime: "4 min read",
    excerpt: "The art of maintaining strong client relationships while delivering exceptional planning services. A blend of professionalism and personality.",
    content: `
      In the world of professional planning, building and maintaining strong client relationships is as crucial as technical expertise. As a cat, I bring a unique perspective to client relationship management, combining natural charm with professional excellence.

      Key Principles of Client Relationships:

      1. Trust Building
         - Consistent communication
         - Reliable delivery
         - Transparent processes
         - Honest feedback

      2. Understanding Needs
         - Active listening
         - Detailed discovery sessions
         - Regular check-ins
         - Adaptability to changing requirements

      3. Professional Excellence
         - High-quality deliverables
         - Meeting deadlines
         - Innovative solutions
         - Continuous improvement

      4. Personal Touch
         - Adding warmth to interactions
         - Remembering personal details
         - Celebrating successes together
         - Being authentically feline

      Communication Strategies:
      - Regular updates
      - Clear documentation
      - Open dialogue
      - Proactive problem-solving

      The Extra Mile:
      Going beyond expectations by:
      - Anticipating needs
      - Providing additional insights
      - Sharing relevant resources
      - Being available for support

      Remember: Just as cats know how to make themselves indispensable to their humans, great planning specialists become invaluable to their clients through dedication, expertise, and genuine care. 🐱💼
    `,
    icon: <HeartHandshake className="text-green-500" size={24} />
  }
];

function BlogPost() {
  const { postId } = useParams();
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Post not found</h2>
        <Link 
          to="/blog"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg">
        <Link 
          to="/blog"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-6"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Blog
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div className="bg-pink-50 p-4 rounded-full">
            {post.icon}
          </div>
          <h1 className="text-3xl font-bold text-purple-600">{post.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} />
            {post.readTime}
          </span>
        </div>

        <div className="prose prose-purple max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="text-gray-700 mb-4 whitespace-pre-wrap">
                {paragraph}
              </p>
            )
          ))}
        </div>
      </div>

      <div className="bg-pink-100 border-4 border-purple-400 rounded-lg p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-purple-600 mb-4">Share Your Thoughts</h3>
        <p className="text-gray-700 mb-4">
          Did you enjoy this article? Leave a comment below!
        </p>
        <textarea
          className="w-full p-4 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 mb-4"
          rows={4}
          placeholder="Your comment..."
        />
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
        >
          Submit Comment
        </button>
      </div>
    </div>
  );
}

export default BlogPost;