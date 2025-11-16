import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import logo from "../assets/logo.jpeg";
import AIBot from "../components/AIBot";
import LogoLoop from "./LogoLoop";

const Landing = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Land Your dream job.";
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setShowCursor(false);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: "🎯", title: "Personalized Recommendations", desc: "AI-powered course and community suggestions" },
    { icon: "📊", title: "Progress Tracking", desc: "Track your learning journey with XP and streaks" },
    { icon: "🏆", title: "Achievements", desc: "Unlock badges and milestones as you learn" },
    { icon: "🤝", title: "Community Support", desc: "Connect with others on similar career paths" },
  ];

  // ✅ Text-based placeholders for logos
  const loopLogos = [
    "React", "Next.js", "TypeScript", "Tailwind CSS",
    "MongoDB", "Node.js", "Express.js"
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 h-full w-full -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      
      

      {/* Animated Blur Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center h-35">
            <div className="flex items-center space-x-4 ml-40">
              <img src={logo} alt="Logo" className="h-16 w-16" />
              <h2 className="text-2xl font-bold text-white">RESKILL AI</h2>
            </div>

            <div className="flex space-x-4 mr-40">
              <Link to="/login">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 text-gray-300 font-bold transition-colors border-2 border-cyan-400 rounded-2xl">
                  Login
                </motion.button>
              </Link>

              <Link to="/signup">
                <motion.button whileHover={{ scale: 1.05 },{ skew: 10}} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Get Started
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-10">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 space-y-4">
            <span className="flex justify-center items-center space-x-4">
              <h3 className="font-bold text-white">Land Your</h3>
              <h3 className="font-bold text-blue-500">dream job.</h3>
            </span>
            <span>
              <h3 className="text-white">Without the stress.</h3>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Transition to new careers with personalized learning paths, community support, and AI-powered recommendations
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-gradient-to-r from-cyan-700 to-purple-700 text-white text-lg font-bold rounded-lg hover:opacity-90 transition-opacity">
                Start Your Journey
              </motion.button>
            </Link>

            
          </div>
        </motion.div>

        {/* OUR FEATURES TITLE */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-center font-bold text-2xl mt-53">
          OUR FEATURES
        </motion.div>

        {/* Features Grid */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }} whileHover={{ scale: 1.05, y: -5 }} className="glass p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all mb-20">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Bot Section */}
        <AIBot />

        <h3 className="font-bold text-3xl text-center mt-50">Trusted by job seekers who've landed at top companies</h3>
        <h4 className="mt-5 text-center text-blue-500">Our users have secured positions at industry-leading companies such as</h4>

        {/* ✅ LOGO LOOP SECTION ADDED HERE */}
        <div className="mt-30">
          <LogoLoop
            items={loopLogos}
            speed={120}
            direction="left"
            gap={50}
            itemHeight={50}
          />
        </div>

      </div>
    </div>
  );
};

export default Landing;
