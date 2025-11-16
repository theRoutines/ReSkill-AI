import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import Layout from '../components/Layout';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await api.get('/progress/achievements');
      setAchievements(response.data.achievements || []);
      setLoading(false);
    } catch (error) {
      console.error('Achievements error:', error);
      setLoading(false);
    }
  };

  const achievementTypes = {
    first_course: { name: 'First Steps', icon: '🎯', color: 'cyan' },
    streak_7: { name: 'Week Warrior', icon: '🔥', color: 'orange' },
    streak_30: { name: 'Monthly Master', icon: '⭐', color: 'yellow' },
    streak_100: { name: 'Century Champion', icon: '💯', color: 'purple' },
    xp_1000: { name: 'Knowledge Seeker', icon: '📚', color: 'blue' },
    xp_5000: { name: 'Expert Learner', icon: '🎓', color: 'purple' },
    xp_10000: { name: 'Master Scholar', icon: '👑', color: 'gold' },
    course_complete: { name: 'Course Completer', icon: '✅', color: 'green' },
    courses_5: { name: 'Course Collector', icon: '🏅', color: 'cyan' },
    courses_10: { name: 'Course Master', icon: '🏆', color: 'purple' },
    community_join: { name: 'Community Builder', icon: '👥', color: 'blue' },
    weekly_challenge: { name: 'Challenge Champion', icon: '⚡', color: 'yellow' },
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
        <h1 className="text-4xl font-bold mb-8 text-white">
          Your Achievements
        </h1>

        <div className="mb-8">
          <div className="glass p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">🏆</div>
              <div>
                <h3 className="text-2xl font-semibold text-cyan-400 mb-2">
                  {achievements.length} Achievements Unlocked
                </h3>
                <p className="text-gray-400">
                  Keep learning to unlock more achievements and showcase your progress!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const typeInfo = achievementTypes[achievement.type] || {
              name: achievement.title,
              icon: achievement.icon || '🏆',
              color: 'cyan'
            };

            return (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">{typeInfo.icon}</div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                    {achievement.title || typeInfo.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>
                  {achievement.xpReward > 0 && (
                    <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      +{achievement.xpReward} XP
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              </motion.div>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">
              No achievements yet
            </h3>
            <p className="text-gray-500">
              Start learning to unlock your first achievement!
            </p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Achievements;

