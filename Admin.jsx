import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import Layout from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [pendingCommunities, setPendingCommunities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: 0,
    skills: [],
    tags: [],
    url: '',
    isActive: true
  });
  const [newSkill, setNewSkill] = useState('');
  const [newTag, setNewTag] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, communitiesRes, coursesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/communities/pending'),
        api.get('/courses') // Admin will see all courses (active and inactive)
      ]);
      setStats(statsRes.data.stats);
      setPendingCommunities(communitiesRes.data.communities || []);
      setCourses(coursesRes.data.courses || []);
      setLoading(false);
    } catch (error) {
      console.error('Admin error:', error);
      setLoading(false);
    }
  };

  const approveCommunity = async (id) => {
    try {
      await api.put(`/communities/${id}/approve`);
      setPendingCommunities(pendingCommunities.filter(c => c._id !== id));
      alert('Community approved!');
      fetchAdminData();
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve community');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
      alert('Course deleted successfully!');
      fetchAdminData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete course');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      skills: course.skills || [],
      tags: course.tags || [],
      url: course.url,
      isActive: course.isActive
    });
    setShowCourseForm(true);
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, courseForm);
        alert('Course updated successfully!');
      } else {
        await api.post('/courses', courseForm);
        alert('Course created successfully!');
      }
      setShowCourseForm(false);
      setEditingCourse(null);
      setCourseForm({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        duration: 0,
        skills: [],
        tags: [],
        url: '',
        isActive: true
      });
      fetchAdminData();
    } catch (error) {
      console.error('Course error:', error);
      alert('Failed to save course');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !courseForm.skills.includes(newSkill.trim())) {
      setCourseForm({
        ...courseForm,
        skills: [...courseForm.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setCourseForm({
      ...courseForm,
      skills: courseForm.skills.filter(s => s !== skill)
    });
  };

  const addTag = () => {
    if (newTag.trim() && !courseForm.tags.includes(newTag.trim())) {
      setCourseForm({
        ...courseForm,
        tags: [...courseForm.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setCourseForm({
      ...courseForm,
      tags: courseForm.tags.filter(t => t !== tag)
    });
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await api.get('/admin/analytics/course-registrations');
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

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
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-cyan-500/20">
          {['dashboard', 'communities', 'courses', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 capitalize transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-cyan-500 text-cyan-400'
                  : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 rounded-xl border border-cyan-500/20"
              >
                <div className="text-3xl mb-2">👥</div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.totalUsers}</div>
                <div className="text-gray-400">Total Users</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass p-6 rounded-xl border border-purple-500/20"
              >
                <div className="text-3xl mb-2">📚</div>
                <div className="text-3xl font-bold text-purple-400 mb-1">{stats.totalCourses}</div>
                <div className="text-gray-400">Total Courses</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-xl border border-blue-500/20"
              >
                <div className="text-3xl mb-2">👥</div>
                <div className="text-3xl font-bold text-blue-400 mb-1">{stats.totalCommunities}</div>
                <div className="text-gray-400">Total Communities</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass p-6 rounded-xl border border-cyan-500/20"
              >
                <div className="text-3xl mb-2">⏳</div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.pendingCommunities}</div>
                <div className="text-gray-400">Pending Communities</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass p-6 rounded-xl border border-purple-500/20"
              >
                <div className="text-3xl mb-2">📊</div>
                <div className="text-3xl font-bold text-purple-400 mb-1">{stats.totalProgress}</div>
                <div className="text-gray-400">Total Progress Entries</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="glass p-6 rounded-xl border border-blue-500/20"
              >
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-3xl font-bold text-blue-400 mb-1">{stats.totalAchievements}</div>
                <div className="text-gray-400">Total Achievements</div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Pending Communities Tab */}
        {activeTab === 'communities' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">Pending Communities</h2>
            <div className="space-y-4">
              {pendingCommunities.map((community, index) => (
                <motion.div
                  key={community._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-6 rounded-xl border border-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-400 mb-2">{community.name}</h3>
                      <p className="text-gray-400 mb-2">{community.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Category: {community.category}</span>
                        <a href={community.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                          View URL →
                        </a>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => approveCommunity(community._id)}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg glow-cyan hover:opacity-90 transition-opacity"
                    >
                      Approve
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              {pendingCommunities.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No pending communities
                </div>
              )}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-400">All Courses</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({
                    title: '',
                    description: '',
                    category: '',
                    level: 'beginner',
                    duration: 0,
                    skills: [],
                    tags: [],
                    url: '',
                    isActive: true
                  });
                  setShowCourseForm(true);
                }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg glow-cyan hover:opacity-90 transition-opacity"
              >
                + Add Course
              </motion.button>
            </div>

            {/* Course Form Modal */}
            {showCourseForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowCourseForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-strong p-8 rounded-2xl border border-cyan-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <h3 className="text-2xl font-bold mb-6 text-cyan-400">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  <form onSubmit={handleSubmitCourse} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        required
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        required
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <input
                          type="text"
                          required
                          value={courseForm.category}
                          onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                          className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                        <select
                          value={courseForm.level}
                          onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                          className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Duration (hours)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({ ...courseForm, duration: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <select
                          value={courseForm.isActive ? 'active' : 'inactive'}
                          onChange={(e) => setCourseForm({ ...courseForm, isActive: e.target.value === 'active' })}
                          className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                      <input
                        type="url"
                        required
                        value={courseForm.url}
                        onChange={(e) => setCourseForm({ ...courseForm, url: e.target.value })}
                        className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {courseForm.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center gap-2">
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          placeholder="Add skill"
                          className="flex-1 px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                        />
                        <button type="button" onClick={addSkill} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg">
                          Add
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {courseForm.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full flex items-center gap-2">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          placeholder="Add tag"
                          className="flex-1 px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                        />
                        <button type="button" onClick={addTag} className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg">
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="flex-1 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg glow-cyan hover:opacity-90 transition-opacity"
                      >
                        {editingCourse ? 'Update Course' : 'Create Course'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          setShowCourseForm(false);
                          setEditingCourse(null);
                        }}
                        className="px-6 py-2 glass border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-6 rounded-xl border border-cyan-500/20"
                >
                  <div className="text-sm text-purple-400 mb-2">{course.category}</div>
                  <h3 className="text-xl font-semibold mb-2 text-cyan-400">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.level} • {course.duration}h</span>
                    <span className={course.isActive ? 'text-green-400' : 'text-red-400'}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditCourse(course)}
                      className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-all"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteCourse(course._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            {courses.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No courses found. Click "Add Course" to create one.
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">Course Registration Analytics</h2>
            
            {analyticsLoading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : analyticsData ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-6 rounded-xl border border-cyan-500/20"
                  >
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">{analyticsData.summary.totalCourses}</div>
                    <div className="text-gray-400">Total Courses</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-xl border border-purple-500/20"
                  >
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-3xl font-bold text-purple-400 mb-1">{analyticsData.summary.totalRegistrations}</div>
                    <div className="text-gray-400">Total Registrations</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-xl border border-blue-500/20"
                  >
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">{analyticsData.summary.totalUniqueUsers}</div>
                    <div className="text-gray-400">Unique Users</div>
                  </motion.div>
                </div>

                {/* Top Courses Bar Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-6 rounded-xl border border-cyan-500/20 mb-8"
                >
                  <h3 className="text-xl font-semibold text-cyan-400 mb-6">Top Courses by Registrations</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={analyticsData.courses.slice(0, 10)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="courseTitle"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #06b6d4',
                          borderRadius: '8px',
                          color: '#e5e7eb'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="totalRegistrations" fill="#06b6d4" name="Total Registrations" />
                      <Bar dataKey="uniqueUsers" fill="#8b5cf6" name="Unique Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Category Distribution Pie Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass p-6 rounded-xl border border-purple-500/20 mb-8"
                >
                  <h3 className="text-xl font-semibold text-purple-400 mb-6">Registrations by Category</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={analyticsData.categories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, totalRegistrations, percent }) => 
                          `${category}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="totalRegistrations"
                      >
                        {analyticsData.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #8b5cf6',
                          borderRadius: '8px',
                          color: '#e5e7eb'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Category Stats Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass p-6 rounded-xl border border-blue-500/20 mb-8"
                >
                  <h3 className="text-xl font-semibold text-blue-400 mb-6">Category Statistics</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-cyan-500/20">
                          <th className="text-left py-3 px-4 text-cyan-400">Category</th>
                          <th className="text-right py-3 px-4 text-cyan-400">Courses</th>
                          <th className="text-right py-3 px-4 text-cyan-400">Total Registrations</th>
                          <th className="text-right py-3 px-4 text-cyan-400">Unique Users</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.categories.map((cat, index) => (
                          <tr key={cat.category} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                            <td className="py-3 px-4 text-gray-300">{cat.category}</td>
                            <td className="py-3 px-4 text-right text-gray-400">{cat.courseCount}</td>
                            <td className="py-3 px-4 text-right text-cyan-400 font-semibold">{cat.totalRegistrations}</td>
                            <td className="py-3 px-4 text-right text-purple-400 font-semibold">{cat.uniqueUsers}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Course Details Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass p-6 rounded-xl border border-cyan-500/20"
                >
                  <h3 className="text-xl font-semibold text-cyan-400 mb-6">All Course Registrations</h3>
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-black/50">
                        <tr className="border-b border-cyan-500/20">
                          <th className="text-left py-3 px-4 text-cyan-400">Course Title</th>
                          <th className="text-left py-3 px-4 text-cyan-400">Category</th>
                          <th className="text-right py-3 px-4 text-cyan-400">Total Registrations</th>
                          <th className="text-right py-3 px-4 text-cyan-400">Unique Users</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.courses.map((course) => (
                          <tr key={course.courseId} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                            <td className="py-3 px-4 text-gray-300">{course.courseTitle}</td>
                            <td className="py-3 px-4 text-gray-400">{course.category}</td>
                            <td className="py-3 px-4 text-right text-cyan-400 font-semibold">{course.totalRegistrations}</td>
                            <td className="py-3 px-4 text-right text-purple-400 font-semibold">{course.uniqueUsers}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No analytics data available. Click the Analytics tab to load data.
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Admin;

