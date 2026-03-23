import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ExternalLink, MessageSquare, Loader2, X, User, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

const Resource = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 NEW: State for the Crawler / Modal
  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchRedditData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API}/reddit/hot?limit=25`);

        if (!response.ok) {
          throw new Error('Failed to fetch from Reddit');
        }

        const json = await response.json();

        const formattedData = json.data.children.map((child) => {
          const post = child.data;
          const { category, type } = categorizePost(post.title, post.selftext);

          return {
            id: post.id,
            category: category,
            type: type,
            title: post.title,
            // 🔥 NEW: Store permalink for crawling later
            permalink: post.permalink,
            // 🔥 NEW: Store selftext for preview
            selftext: post.selftext, 
            date: new Date(post.created_utc * 1000).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            }),
            readTime: `${post.num_comments} comments`,
            commentCount: post.num_comments, // stored as number for logic
            url: `https://www.reddit.com${post.permalink}`,
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

  // Existing Category Logic
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

  // 🔥 NEW: Crawler Function (Fetches comments & full text)
  const fetchPostDetails = async (permalink) => {
    setDetailsLoading(true);
    setPostDetails(null);
    try {
      // Append .json to get the data format
      const response = await fetch(`${API}/reddit/post?permalink=${encodeURIComponent(permalink)}`);
      const json = await response.json();

      // Reddit API returns an array: [0] = post, [1] = comments
      const originalPost = json[0].data.children[0].data;
      const comments = json[1].data.children.map(child => child.data);

      setPostDetails({
        fullText: originalPost.selftext,
        comments: comments.slice(0, 10) // Limit to top 10 comments
      });
    } catch (err) {
      console.error("Failed to crawl details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // 🔥 NEW: Handlers for Modal
  const openPost = (post) => {
    setSelectedPost(post);
    fetchPostDetails(post.permalink);
  };

  const closePost = () => {
    setSelectedPost(null);
    setPostDetails(null);
  };

  const filteredResources = activeTab === 'all'
    ? resources
    : resources.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">React Career Hub</h1>
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
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab === 'tech' ? 'Dev Discussions' : tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            >
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  // 🔥 CHANGED: Use onClick instead of href to open modal
                  onClick={() => openPost(resource)}
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

                  {/* Image or Placeholder */}
                  {resource.image ? (
                      <div className="mb-4 w-full h-40 overflow-hidden rounded-lg bg-gray-100">
                        <img src={resource.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                  ) : (
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
                </div>
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

        {/* 🔥 NEW: Modal for Deep Details */}
        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closePost} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              {/* Modal Box */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 pr-8">{selectedPost.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center"><User size={14} className="mr-1"/> {selectedPost.author}</span>
                      <span className="flex items-center text-orange-500"><ArrowUp size={14} className="mr-1"/> {selectedPost.score} points</span>
                    </div>
                  </div>
                  <button onClick={closePost} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="overflow-y-auto p-6 space-y-6">
                  {detailsLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600 w-8 h-8"/></div>
                  ) : (
                    <>
                      {/* Full Post Text */}
                      <div className="prose prose-blue max-w-none text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                         {postDetails?.fullText ? (
                           <div className="whitespace-pre-line">{postDetails.fullText}</div>
                         ) : (
                           <em className="text-gray-400">No text content (likely an image or link post)</em>
                         )}
                      </div>
                      
                      <a href={selectedPost.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:underline font-medium">
                        View original thread on Reddit <ExternalLink size={14} className="ml-1"/>
                      </a>

                      {/* Comments Section */}
                      <div className="mt-6">
                        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                          <MessageSquare size={18} className="mr-2"/> Top Comments
                        </h3>
                        <div className="space-y-4">
                          {postDetails?.comments && postDetails.comments.length > 0 ? (
                            postDetails.comments.map((comment) => (
                              comment.body ? (
                                <div key={comment.id} className="border-l-2 border-gray-200 pl-4 py-2">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span className="font-bold text-gray-700">{comment.author}</span>
                                    <span>{comment.score} pts</span>
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed">{comment.body}</p>
                                </div>
                              ) : null
                            ))
                          ) : (
                             <p className="text-gray-400 text-sm">No comments loaded.</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Resource;