import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState('');

  const quotes = [
    "The future belongs to those who learn more skills and combine them in creative ways.",
    "Your career transition is not a sprint, it's a marathon. Every step counts.",
    "AI may replace jobs, but it can't replace your ability to learn and adapt.",
    "The best time to start learning was yesterday. The second best time is now.",
    "Success is the sum of small efforts repeated day in and day out.",
  ];

  useEffect(() => {
    fetchDashboardData();
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [progressRes, coursesRes, analyticsRes] = await Promise.all([
        api.get('/progress'),
        api.get('/courses/recommendations'),
        api.get('/progress/analytics')
      ]);

      setStats(progressRes.data.stats);
      setRecommendations(coursesRes.data.courses?.slice(0, 3) || []);
      setLoading(false);
    } catch (error) {
      console.error('Dashboard error:', error);
      setLoading(false);
    }
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
        {/* Hero Section */}
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4  "
          >
            Welcome Back! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-xl border border-cyan-500/20"
          >
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-cyan-400 mb-1">{stats?.streak || 0}</div>
            <div className="text-gray-400">Day Streak</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-xl border border-purple-500/20"
          >
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-purple-400 mb-1">{stats?.totalXP || 0}</div>
            <div className="text-gray-400">Total XP</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-xl border border-blue-500/20"
          >
            <div className="text-3xl mb-2">📚</div>
            <div className="text-3xl font-bold text-blue-400 mb-1">{stats?.completedCount || 0}</div>
            <div className="text-gray-400">Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-xl border border-cyan-500/20"
          >
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-3xl font-bold text-cyan-400 mb-1">{Math.round((stats?.totalTime || 0) / 60)}h</div>
            <div className="text-gray-400">Time Spent</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/courses">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">Browse Courses</h3>
              <p className="text-gray-400">Discover personalized course recommendations</p>
            </motion.div>
          </Link>

          <Link to="/communities">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Join Communities</h3>
              <p className="text-gray-400">Connect with like-minded learners</p>
            </motion.div>
          </Link>

          <Link to="/progress">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">View Progress</h3>
              <p className="text-gray-400">Track your learning journey</p>
            </motion.div>
          </Link>
        </div>

        {/* Recommended Courses */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="glass p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                >
                  <div className="text-sm text-purple-400 mb-2">{course.category}</div>
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{course.level} • {course.duration}h</span>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      View Course →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Dashboard;

