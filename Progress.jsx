import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import Layout from '../components/Layout';

const Progress = () => {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
    fetchAnalytics();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await api.get('/progress');
      setProgress(response.data.progress || []);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Progress error:', error);
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/progress/analytics');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Analytics error:', error);
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

  const xpToNextLevel = (currentXP) => {
    const levels = [0, 100, 500, 1000, 2500, 5000, 10000, 25000];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (currentXP >= levels[i]) {
        return { level: i + 1, current: currentXP, next: levels[i + 1] || Infinity, progress: levels[i + 1] ? ((currentXP - levels[i]) / (levels[i + 1] - levels[i])) * 100 : 100 };
      }
    }
    return { level: 1, current: currentXP, next: 100, progress: (currentXP / 100) * 100 };
  };

  const levelInfo = xpToNextLevel(stats?.totalXP || 0);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 ">
          Your Progress
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-xl border border-purple-500/20"
          >
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-purple-400 mb-1">{stats?.totalXP || 0}</div>
            <div className="text-gray-400">Total XP</div>
            <div className="text-xs text-gray-500 mt-2">Level {levelInfo.level}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
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
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-xl border border-cyan-500/20"
          >
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-3xl font-bold text-cyan-400 mb-1">{Math.round((stats?.totalTime || 0) / 60)}h</div>
            <div className="text-gray-400">Time Spent</div>
          </motion.div>
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-xl border border-purple-500/20 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-purple-400">Level Progress</h3>
            <span className="text-sm text-gray-400">Level {levelInfo.level}</span>
          </div>
          <div className="relative h-4 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(levelInfo.progress, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full gradient-cyan-purple"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{levelInfo.current} XP</span>
            <span>{levelInfo.next === Infinity ? 'Max Level' : `${levelInfo.next} XP`}</span>
          </div>
        </motion.div>

        {/* Weekly Analytics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-6 rounded-xl border border-cyan-500/20"
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">XP Gained</span>
                  <span className="text-cyan-400 font-semibold">{analytics.weekly.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Spent</span>
                  <span className="text-cyan-400 font-semibold">{Math.round(analytics.weekly.time / 60)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Activities</span>
                  <span className="text-cyan-400 font-semibold">{analytics.weekly.activities}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-6 rounded-xl border border-purple-500/20"
            >
              <h3 className="text-lg font-semibold text-purple-400 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">XP Gained</span>
                  <span className="text-purple-400 font-semibold">{analytics.monthly.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Spent</span>
                  <span className="text-purple-400 font-semibold">{Math.round(analytics.monthly.time / 60)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Activities</span>
                  <span className="text-purple-400 font-semibold">{analytics.monthly.activities}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Recent Progress */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Recent Activity</h2>
          <div className="space-y-4">
            {progress.slice(0, 10).map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-4 rounded-xl border border-cyan-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-cyan-400">
                      {item.courseId?.title || item.communityId?.name || 'Activity'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-semibold">+{item.xpGained || 0} XP</div>
                    <div className="text-xs text-gray-500">{item.timeSpent || 0} min</div>
                  </div>
                </div>
              </motion.div>
            ))}
            {progress.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No progress yet. Start learning to track your journey!
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Progress;

