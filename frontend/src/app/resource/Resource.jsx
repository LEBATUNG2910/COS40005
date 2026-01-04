import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ExternalLink, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Resource = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRedditData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetching from r/react "hot" feed as per your code
        const response = await fetch('https://www.reddit.com/r/react/hot.json?limit=25');

        if (!response.ok) {
          throw new Error('Failed to fetch from Reddit');
        }

        const json = await response.json();

        // Map Reddit data to our UI shape
        const formattedData = json.data.children.map((child) => {
          const post = child.data;

          // Helper to guess category based on title keywords
          const { category, type } = categorizePost(post.title, post.selftext);

          return {
            id: post.id,
            category: category,
            type: type, // Matches your activeTab values
            title: post.title,
            // Convert UNIX timestamp to readable date
            date: new Date(post.created_utc * 1000).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            }),
            // Use comment count as a metric
            readTime: `${post.num_comments} comments`,
            url: `https://www.reddit.com${post.permalink}`,
            // Check for valid thumbnail URL
            image: (post.thumbnail && post.thumbnail.startsWith('http')) ? post.thumbnail : undefined,
            author: post.author,
            score: post.score
          };
        });

        setResources(formattedData);
      } catch (err) {
        console.error("Error fetching Reddit data:", err);
        setError("Could not load latest discussions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRedditData();
  }, []);

  // Simple keyword matching to assign categories
  const categorizePost = (title, body) => {
    const text = (title + " " + (body || "")).toLowerCase();

    if (text.includes('resume') || text.includes('cv') || text.includes('hiring')) {
      return { category: 'RESUME ADVICE', type: 'resume' };
    } else if (text.includes('interview') || text.includes('question') || text.includes('ask')) {
      return { category: 'INTERVIEW HELP', type: 'interview' };
    } else if (text.includes('job') || text.includes('career') || text.includes('work')) {
      return { category: 'CAREER GROWTH', type: 'cover-letter' };
    } else {
      return { category: 'REACT NEWS', type: 'tech' };
    }
  };

  // Filter logic
  const filteredResources = activeTab === 'all'
    ? resources
    : resources.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">React Career Hub</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Latest discussions, job tips, and library updates directly from the React community.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10 overflow-x-auto">
          <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            {['all', 'tech', 'interview', 'cover-letter'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab === 'tech' ? 'Dev Discussions' : tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area with Animation */}
        {loading ? (
           <div className="flex justify-center items-center h-64">
             <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
           </div>
        ) : error ? (
           <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg border border-red-100">
             <p>{error}</p>
           </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>No posts found for this category right now.</p>
          </div>
        ) : (
          /* Wrap grid in AnimatePresence and motion.div */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} // Trigger animation when tab changes
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            >
              {filteredResources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col h-full group"
                >
                  {/* Category Tag */}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-bold tracking-wider uppercase ${
                      resource.type === 'tech' ? 'text-purple-500' : 'text-blue-500'
                    }`}>
                        {resource.category}
                    </span>
                    <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors"/>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-3">
                    {resource.title}
                  </h3>

                  {/* Author Info */}
                  <p className="text-sm text-gray-400 mb-4">Posted by u/{resource.author}</p>

                  {/* Optional Image or Description Placeholder */}
                  {resource.image ? (
                     <div className="mb-4 w-full h-40 overflow-hidden rounded-lg bg-gray-100">
                       <img src={resource.image} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                  ) : (
                    // If no image, show a snippet or visual placeholder
                    <div className="mb-4 w-full h-32 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                      <span className="text-4xl">⚛️</span>
                    </div>
                  )}

                  <div className="flex-grow"></div>

                  {/* Metadata */}
                  <div className="pt-4 border-t border-gray-100 mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {resource.date}
                          </span>
                          <span className="flex items-center">
                              <MessageSquare size={12} className="mr-1" />
                              {resource.readTime}
                          </span>
                        </div>
                        <span className="font-semibold text-emerald-600">
                          {resource.score} upvotes
                        </span>
                    </div>
                  </div>
                </a>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bottom Banner */}
        <div className="bg-cyan-500 rounded-2xl overflow-hidden shadow-xl relative mt-16">
           <div className="px-8 py-12 text-center md:text-left relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Need personalized advice?</h2>
              <p className="text-cyan-100 mb-6">Our AI analyzes thousands of successful tech resumes to build yours.</p>
              <button className="bg-white text-black font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                  Build React Resume
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Resource;