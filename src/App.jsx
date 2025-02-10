import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import ChatContainer from './components/Chat/ChatContainer'
import GeminiContainer from './components/Gemini/GeminiContainer'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import './App.css'

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return true;
    }
    return false;
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const models = [
    { 
      name: 'Mistral', 
      path: '/',
      gradient: 'from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400',
      shadow: 'shadow-emerald-500/30 hover:shadow-emerald-500/40',
      border: 'border-emerald-600/20'
    },
    { 
      name: 'Gemini', 
      path: '/gemini',
      gradient: 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400',
      shadow: 'shadow-blue-500/30 hover:shadow-blue-500/40',
      border: 'border-blue-600/20'
    }
  ];

  const currentModel = models.find(model => model.path === location.pathname) || models[0];

  useEffect(() => {
    // Update class on document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      {/* Navigation */}
      <nav className={`fixed top-0 left-60 right-0 h-16 ${
        currentModel.name === 'Gemini' 
          ? 'bg-[#0c1620] border-blue-800/20' 
          : 'bg-[#0c1716] border-emerald-800/20'
      } border-b backdrop-blur-xl z-50`}>
        <div className="h-full flex justify-center items-center">
          <div ref={dropdownRef} className="relative inline-block text-left">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all
                       flex items-center gap-2
                       bg-gradient-to-r ${currentModel.gradient}
                       text-white shadow-lg ${currentModel.shadow}
                       border ${currentModel.border}`}
            >
              {currentModel.name}
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-full left-0 mt-2 min-w-[160px] ${currentModel.name === 'Gemini' ? 'bg-[#0c1620] border-blue-800/20' : 'bg-[#0c1716] border-emerald-800/20'} rounded-lg border overflow-hidden shadow-xl z-[100]`}
                >
                  {models.map((model) => (
                    <Link
                      key={model.path}
                      to={model.path}
                      onClick={() => setIsDropdownOpen(false)}
                      className={`block w-full px-6 py-2.5 text-sm font-medium text-left transition-all
                                hover:bg-white/5 ${model.name === 'Gemini' ? 'text-blue-300/90' : 'text-emerald-300/90'}
                                ${location.pathname === model.path ? 'bg-white/10' : ''}`}
                    >
                      {model.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<ChatContainer />} />
          <Route path="/gemini" element={<GeminiContainer />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
