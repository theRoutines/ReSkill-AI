import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import Layout from '../components/Layout';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [progressCourseIds, setProgressCourseIds] = useState([]);
  const [addingProgress, setAddingProgress] = useState({});

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
    'Other'
  ];

  useEffect(() => {
    fetchCourses();
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      const response = await api.get('/progress');
      const courseIds = response.data.progress
        .filter(p => p.courseId)
        .map(p => p.courseId._id || p.courseId);
      setProgressCourseIds(courseIds);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  useEffect(() => {
    filterCourses();
  }, [courses, search, category, level]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/recommendations');
      setCourses(response.data.courses || []);
      setFilteredCourses(response.data.courses || []);
      setLoading(false);
    } catch (error) {
      console.error('Courses error:', error);
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (search) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()) ||
        course.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (category) {
      filtered = filtered.filter(course => course.category === category);
    }

    if (level) {
      filtered = filtered.filter(course => course.level === level);
    }

    setFilteredCourses(filtered);
  };

  const addProgress = async (courseId) => {
    // Check if already in progress
    if (progressCourseIds.includes(courseId)) {
      return;
    }

    setAddingProgress(prev => ({ ...prev, [courseId]: true }));
    
    try {
      const response = await api.post('/progress', {
        courseId,
        xpGained: 10,
        timeSpent: 30
      });
      
      // Add to progress array
      setProgressCourseIds(prev => [...prev, courseId]);
      alert('Progress added! Keep learning! 🎉');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add progress';
      alert(message);
      console.error('Add progress error:', error);
    } finally {
      setAddingProgress(prev => {
        const newState = { ...prev };
        delete newState[courseId];
        return newState;
      });
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
        <h1 className="text-4xl font-bold mb-8 ">
          Course Recommendations
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
              <h3 className="text-xl font-semibold text-purple-400 mb-2">AI-Powered Recommendations</h3>
              <p className="text-gray-300">
                Based on your profile, skills, and goals, we've curated these courses to help you transition 
                into your new career. Each recommendation is tailored to bridge your skill gaps and align with 
                your preferred learning style.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="glass p-6 rounded-xl border border-cyan-500/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search courses..."
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
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="glass p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                  {course.category}
                </span>
                <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                  {course.level}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{course.description}</p>
              
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Skills:</div>
                <div className="flex flex-wrap gap-2">
                  {course.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                      {skill}
                    </span>
                  ))}
                  {course.skills.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded">
                      +{course.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{course.duration}h • {course.provider}</span>
                <span>⭐ {course.rating || 'N/A'}</span>
              </div>

              <div className="flex gap-2">
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  View Course
                </a>
                {progressCourseIds.includes(course._id) ? (
                  <motion.button
                    disabled
                    className="px-4 py-2 glass border border-green-500/50 text-green-400 rounded-lg opacity-75 cursor-not-allowed flex items-center gap-2"
                  >
                    <span>✓</span>
                    <span>In Progress</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addProgress(course._id)}
                    disabled={addingProgress[course._id]}
                    className="px-4 py-2 glass border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingProgress[course._id] ? 'Adding...' : '+ Progress'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No courses found. Try adjusting your filters.
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Courses;

