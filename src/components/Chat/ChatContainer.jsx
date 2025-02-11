import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Send as SendIcon, Menu, Settings, Plus, MessageSquare, Trash2, Sun, Moon, Volume2, VolumeX, Languages, ChevronDown } from 'lucide-react';
import { generateResponse } from '../../services/mistralService';
import { saveChat, loadChats, deleteChat, clearAllChats } from '../../services/dbService';
import { sanitizeInput } from '../../utils/sanitizer';
import { Link } from 'react-router-dom';

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [previousChats, setPreviousChats] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [settings, setSettings] = useState({
    sound: true,
    language: 'id',
  });
  const messagesEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Load settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // Deteksi Mobile dan atur sidebar
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsSidebarOpen(false);
      }
    };

    // Check initial
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSound = () => {
    setSettings(prev => ({
      ...prev,
      sound: !prev.sound
    }));
  };

  const toggleLanguage = () => {
    setSettings(prev => ({
      ...prev,
      language: prev.language === 'id' ? 'en' : 'id'
    }));
  };

  // Load previous chats on mount
  useEffect(() => {
    const loadPreviousChats = async () => {
      const chats = await loadChats();
      setPreviousChats(chats);
    };
    loadPreviousChats();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Tutup sidebar di mobile setelah memilih chat
  const handleLoadChat = async (chat) => {
    // Simpan chat yang sedang aktif jika ada pesan
    if (messages.length > 0 && currentChatId !== chat.id) {
      await saveChat(messages);
    }
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    
    // Tutup sidebar jika di mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Tutup sidebar di mobile setelah membuat chat baru
  const createNewChat = async () => {
    // Simpan chat yang sedang aktif jika ada pesan
    if (messages.length > 0) {
      await saveChat(messages);
      const chats = await loadChats();
      setPreviousChats(chats);
    }
    
    // Buat chat baru
    setMessages([]);
    setCurrentChatId(null);

    // Tutup sidebar jika di mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = async (messageText, imageFile = null) => {
    if (!messageText.trim()) return;

    setError(null);
    const userMessage = { 
      text: messageText, 
      isUser: true,
      image: imageFile ? URL.createObjectURL(imageFile) : null 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botMessage = { text: '', isUser: false };
      setMessages(prev => [...prev, botMessage]);

      const updateBotMessage = (newText) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], text: newText };
          return updated;
        });
      };

      const response = await generateResponse(messageText, messages, updateBotMessage, imageFile);
      
      // Simpan chat setelah mendapat respons
      const updatedMessages = [...messages, userMessage, { text: response, isUser: false }];
      await saveChat(updatedMessages);
      
      // Reload previous chats
      const chats = await loadChats();
      setPreviousChats(chats);
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = async () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setMessages([]);
    await clearAllChats();
    setPreviousChats([]);
    setShowDeleteConfirm(false);
  };

  const handleDeleteChat = async (id, e) => {
    e.stopPropagation();
    await deleteChat(id);
    const chats = await loadChats();
    setPreviousChats(chats);
  };

  return (
    <div className={`fixed inset-0 flex ${isDarkMode ? 'bg-black' : 'bg-white'} text-gray-100 transition-colors duration-200`}>
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -240 }}
        animate={{ x: isSidebarOpen ? 0 : -240 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.6 }}
        className={`${
          isSidebarOpen ? 'w-[240px]' : 'w-0'
        } flex flex-col bg-[#0c1716] border-r border-emerald-800/20 overflow-hidden backdrop-blur-xl relative mt-16 z-40`}
      >
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              {/* Sidebar Header */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 border-b border-emerald-800/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2.5 hover:bg-emerald-800/10 rounded-lg transition-all border border-emerald-800/20 hover:border-emerald-700/30"
                  >
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="36" 
                      height="36" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-emerald-400"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 180 }}
                      exit={{ rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </motion.svg>
                  </motion.button>
                </div>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createNewChat}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-emerald-50 px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:from-emerald-500 hover:to-emerald-400 border border-emerald-500/20"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-base font-medium">Baru</span>
                </motion.button>
              </motion.div>

              {/* Sidebar Navigation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                  <AnimatePresence>
                    {isSidebarOpen ? (
                      previousChats.map((chat, i) => (
                        <motion.button
                          key={chat.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleLoadChat(chat)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-base text-emerald-300/70 hover:bg-emerald-800/10 rounded-lg transition-all group border border-emerald-800/20 hover:border-emerald-700/30"
                        >
                          <MessageSquare className="w-5 h-5 text-emerald-500/70 group-hover:text-emerald-400 transition-colors" />
                          <span className="flex-1 truncate text-left">
                            {chat.messages[0]?.text?.slice(0, 30)}...
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-md"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </motion.button>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={createNewChat}
                          className="p-2 hover:bg-emerald-800/10 rounded-lg transition-all border border-emerald-800/20 hover:border-emerald-700/30"
                        >
                          <Plus className="w-4 h-4 text-emerald-400" />
                        </motion.button>
                        {previousChats.slice(0, 3).map((chat, i) => (
                          <motion.button
                            key={chat.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 * i }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleLoadChat(chat)}
                            className="p-2 hover:bg-emerald-800/10 rounded-lg transition-all border border-emerald-800/20 hover:border-emerald-700/30"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </nav>

                {/* Sidebar Footer */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 border-t border-emerald-800/20 space-y-1"
                >
                  <AnimatePresence>
                    {isSidebarOpen ? (
                      <>
                        {[
                          { icon: <Trash2 className="w-4 h-4" />, text: "Hapus percakapan", onClick: clearChat },
                          { icon: isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, text: isDarkMode ? "Mode Terang" : "Mode Gelap", onClick: toggleTheme },
                          { icon: <Settings className="w-4 h-4" />, text: "Pengaturan", onClick: () => setIsSettingsOpen(true) }
                        ].map((item, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: 0.1 * i }}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={item.onClick}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-base text-emerald-300/70 hover:bg-emerald-800/10 rounded-lg transition-all group border border-emerald-800/20 hover:border-emerald-700/30"
                          >
                            <div className="w-5 h-5">{item.icon}</div>
                            <span>{item.text}</span>
                          </motion.button>
                        ))}
                      </>
                    ) : (
                      <motion.div className="flex flex-col items-center gap-2">
                        {[
                          { icon: <Trash2 className="w-4 h-4" />, onClick: clearChat },
                          { icon: isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, onClick: toggleTheme },
                          { icon: <Settings className="w-4 h-4" />, onClick: () => setIsSettingsOpen(true) }
                        ].map((item, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 * i }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={item.onClick}
                            className="p-2 hover:bg-emerald-800/10 rounded-lg transition-all border border-emerald-800/20 hover:border-emerald-700/30"
                          >
                            {item.icon}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Menu Button (Visible when sidebar is closed) */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-30 p-2 hover:bg-emerald-800/10 rounded-lg transition-all border border-emerald-800/20 hover:border-emerald-700/30 bg-[#0c1716]"
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-emerald-400"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </motion.svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-[#0c1716] border-l border-emerald-800/20 p-6 z-20 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-emerald-50">Pengaturan</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-emerald-800/10 rounded-lg"
                >
                  <Settings className="w-5 h-5 text-emerald-400" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-4 bg-[#0f1f1d] rounded-lg border border-emerald-800/20 hover:border-emerald-700/30"
                >
                  <span className="text-emerald-300/90">Mode {isDarkMode ? 'Terang' : 'Gelap'}</span>
                  {isDarkMode ? <Sun className="w-5 h-5 text-emerald-400" /> : <Moon className="w-5 h-5 text-emerald-400" />}
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={toggleSound}
                  className="w-full flex items-center justify-between p-4 bg-[#0f1f1d] rounded-lg border border-emerald-800/20 hover:border-emerald-700/30"
                >
                  <span className="text-emerald-300/90">Suara {settings.sound ? 'Aktif' : 'Nonaktif'}</span>
                  {settings.sound ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-emerald-400" />}
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-between p-4 bg-[#0f1f1d] rounded-lg border border-emerald-800/20 hover:border-emerald-700/30"
                >
                  <span className="text-emerald-300/90">Bahasa: {settings.language === 'id' ? 'Indonesia' : 'English'}</span>
                  <Languages className="w-5 h-5 text-emerald-400" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0c1716] p-6 rounded-lg border border-emerald-800/20 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-semibold mb-4 text-emerald-50">Konfirmasi Hapus</h3>
              <p className="text-emerald-300/70 mb-6">Apakah Anda yakin ingin menghapus semua percakapan? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-4 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-emerald-800/20 hover:bg-emerald-800/10 transition-colors text-emerald-300/90"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                >
                  Hapus
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col bg-[#0c1716] min-w-0 relative transition-colors duration-200`}>
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pb-40">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center min-h-full"
          >
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] w-full max-w-4xl mx-auto px-8"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800/20 flex items-center justify-center border border-emerald-700/30">
                    <MessageSquare className="w-10 h-10 text-emerald-400" />
                  </div>
                  <p className="text-xl text-emerald-300/70 max-w-2xl">
                    Tanyakan apa saja kepada saya. Saya akan membantu Anda dengan sebaik mungkin.
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <div className="flex flex-col w-full max-w-4xl mx-auto min-w-[200px] px-8">
                <div className="flex flex-col gap-8 py-8">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <ChatBubble
                        message={message}
                        isUser={message.isUser}
                      />
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} className="h-20" />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0c1716] via-[#0c1716]/80 to-transparent py-4 px-4 transition-all duration-300 z-20"
        >
          <div className="w-full max-w-4xl mx-auto space-y-4">
            <div ref={dropdownRef} className="w-full relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-all
                         flex items-center justify-between
                         bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400
                         text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40
                         border border-emerald-600/20`}
              >
                Mistral
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 bottom-full mb-2 bg-[#0c1716] border-emerald-800/20 rounded-lg border overflow-hidden shadow-xl z-[100]"
                  >
                    <Link
                      to="/"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block w-full px-4 py-2 text-sm font-medium text-left transition-all hover:bg-white/5 text-emerald-500 bg-white/10"
                    >
                      Mistral
                    </Link>
                    <Link
                      to="/gemini"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block w-full px-4 py-2 text-sm font-medium text-left transition-all hover:bg-white/5 text-blue-500"
                    >
                      Gemini
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-[#0f1f1d] rounded-lg border border-emerald-800/20 shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <ChatInput onSendMessage={handleSendMessage} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-center mt-3 text-emerald-500/50"
            >
              Mistral dapat membuat kesalahan. Pertimbangkan untuk memeriksa informasi penting.
            </motion.p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ChatContainer;