import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: [],
    goals: [],
    preferredIndustries: [],
    learningPreferences: {
      pace: 'moderate',
      format: ['video'],
      duration: 'medium'
    }
  });
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const userData = response.data.user;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        skills: userData.skills || [],
        goals: userData.goals || [],
        preferredIndustries: userData.preferredIndustries || [],
        learningPreferences: userData.learningPreferences || {
          pace: 'moderate',
          format: ['video'],
          duration: 'medium'
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Profile error:', error);
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/profile', formData);
      setUser(response.data.user);
      setEditing(false);
      // Update auth context
      await updateUser();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const addGoal = () => {
    if (newGoal.trim() && !formData.goals.includes(newGoal.trim())) {
      setFormData({
        ...formData,
        goals: [...formData.goals, newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  const removeGoal = (goal) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter(g => g !== goal)
    });
  };

  const addIndustry = () => {
    if (newIndustry.trim() && !formData.preferredIndustries.includes(newIndustry.trim())) {
      setFormData({
        ...formData,
        preferredIndustries: [...formData.preferredIndustries, newIndustry.trim()]
      });
      setNewIndustry('');
    }
  };

  const removeIndustry = (industry) => {
    setFormData({
      ...formData,
      preferredIndustries: formData.preferredIndustries.filter(i => i !== industry)
    });
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold gradient-cyan-purple bg-clip-text text-transparent">
            Your Profile
          </h1>
          {!editing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg glow-cyan hover:opacity-90 transition-opacity"
            >
              Edit Profile
            </motion.button>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-xl border border-cyan-500/20"
          >
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white disabled:opacity-50"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white opacity-50 cursor-not-allowed"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-xl border border-purple-500/20"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center gap-2"
                >
                  {skill}
                  {editing && (
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill"
                  className="flex-1 px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-all"
                >
                  Add
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-xl border border-blue-500/20"
          >
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Career Goals</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.goals.map((goal, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full flex items-center gap-2"
                >
                  {goal}
                  {editing && (
                    <button
                      type="button"
                      onClick={() => removeGoal(goal)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                  placeholder="Add a goal"
                  className="flex-1 px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
                <button
                  type="button"
                  onClick={addGoal}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-all"
                >
                  Add
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-xl border border-cyan-500/20"
          >
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">Preferred Industries</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.preferredIndustries.map((industry, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full flex items-center gap-2"
                >
                  {industry}
                  {editing && (
                    <button
                      type="button"
                      onClick={() => removeIndustry(industry)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
                  placeholder="Add an industry"
                  className="flex-1 px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
                <button
                  type="button"
                  onClick={addIndustry}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all"
                >
                  Add
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 rounded-xl border border-purple-500/20"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-4">Learning Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Learning Pace</label>
                <select
                  value={formData.learningPreferences.pace}
                  onChange={(e) => setFormData({
                    ...formData,
                    learningPreferences: { ...formData.learningPreferences, pace: e.target.value }
                  })}
                  disabled={!editing}
                  className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white disabled:opacity-50"
                >
                  <option value="slow">Slow</option>
                  <option value="moderate">Moderate</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Duration</label>
                <select
                  value={formData.learningPreferences.duration}
                  onChange={(e) => setFormData({
                    ...formData,
                    learningPreferences: { ...formData.learningPreferences, duration: e.target.value }
                  })}
                  disabled={!editing}
                  className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white disabled:opacity-50"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>
          </motion.div>

          {editing && (
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg glow-cyan hover:opacity-90 transition-opacity"
              >
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
                className="px-6 py-2 glass border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          )}
        </form>
      </motion.div>
    </Layout>
  );
};

export default Profile;

