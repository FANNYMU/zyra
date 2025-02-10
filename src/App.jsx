import { useState, useEffect } from 'react'
import ChatContainer from './components/Chat/ChatContainer'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return true;
    }
    return false;
  });

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
      <ChatContainer />
    </div>
  )
}

export default App
