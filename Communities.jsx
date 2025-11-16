import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import Layout from '../components/Layout';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'Web Development',
    'Data Science',
    'AI/ML',
    'Cybersecurity',
    'Cloud Computing',
    'Digital Marketing',
    'UI/UX Design',
    'Project Management',
    'Business Analysis',
    'DevOps',
    'Mobile Development',
    'Career Transition',
    'Other'
  ];

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    filterCommunities();
  }, [communities, search, category]);

  const fetchCommunities = async () => {
    try {
      // Try to get personalized recommendations first
      const response = await api.get('/communities/recommendations');
      const communities = response.data.communities || [];
      
      // If no recommendations, fall back to all approved communities
      if (communities.length === 0) {
        const fallbackResponse = await api.get('/communities');
        const fallbackCommunities = fallbackResponse.data.communities || [];
        setCommunities(fallbackCommunities);
        setFilteredCommunities(fallbackCommunities);
      } else {
        setCommunities(communities);
        setFilteredCommunities(communities);
      }
      setLoading(false);
    } catch (error) {
      console.error('Communities error:', error);
      // Fallback to public endpoint if recommendations fail
      try {
        const fallbackResponse = await api.get('/communities');
        const fallbackCommunities = fallbackResponse.data.communities || [];
        setCommunities(fallbackCommunities);
        setFilteredCommunities(fallbackCommunities);
      } catch (fallbackError) {
        console.error('Fallback communities error:', fallbackError);
      }
      setLoading(false);
    }
  };

  const filterCommunities = () => {
    let filtered = [...communities];

    if (search) {
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(search.toLowerCase()) ||
        community.description.toLowerCase().includes(search.toLowerCase()) ||
        community.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (category) {
      filtered = filtered.filter(community => community.category === category);
    }

    setFilteredCommunities(filtered);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 ">
          Community Recommendations
        </h1>

        {/* AI Reasoning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-xl border border-purple-500/20 mb-8"
        >
          <div className="flex items-start space-x-4">
            <div className="text-3xl">🤖</div>
            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-2">AI-Powered Community Matching</h3>
              <p className="text-gray-300">
                Based on your skills, goals, and preferred industries, we've matched you with communities 
                where you can connect with peers, share experiences, and accelerate your career transition. 
                These communities align with your learning path and career aspirations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="glass p-6 rounded-xl border border-cyan-500/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community, index) => (
            <motion.div
              key={community._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="glass p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                  {community.category}
                </span>
                <span className="text-xs text-gray-500">
                  👥 {community.memberCount?.toLocaleString() || 'N/A'}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">{community.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{community.description}</p>
              
              {community.tags && community.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {community.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={community.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Join Community →
              </a>
            </motion.div>
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No communities found. Try adjusting your filters.
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Communities;

