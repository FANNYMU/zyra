import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from '../Chat/ChatBubble';
import ChatInput from '../Chat/ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Send as SendIcon, Menu, Settings, Plus, MessageSquare, Trash2, Sun, Moon, Volume2, VolumeX, Languages } from 'lucide-react';
import { generateGeminiResponse } from '../../services/geminiService';
import { sanitizeInput } from '../../utils/sanitizer';

const GeminiContainer = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [settings, setSettings] = useState({
    sound: true,
    language: 'id',
  });
  const messagesEndRef = useRef(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      const response = await generateGeminiResponse(messageText, messages, updateBotMessage, imageFile);
      
      // Update messages with bot response
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: response, isUser: false };
        return updated;
      });
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed inset-0 flex ${isDarkMode ? 'bg-black' : 'bg-white'} text-gray-100 transition-colors duration-200`}>
      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#0c1620] min-w-0 relative transition-colors duration-200 mt-16">
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
                  <div className="w-20 h-20 mx-auto rounded-full bg-blue-800/20 flex items-center justify-center border border-blue-700/30">
                    <MessageSquare className="w-10 h-10 text-blue-400" />
                  </div>
                  <p className="text-xl text-blue-300/70 max-w-2xl">
                    Tanyakan apa saja kepada Gemini. Saya akan membantu Anda dengan sebaik mungkin.
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
                        theme="blue"
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
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0c1620] via-[#0c1620]/80 to-transparent py-4 px-4 transition-all duration-300 z-20"
        >
          <div className="w-full max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-[#0f1f2d] rounded-lg border border-blue-800/20 shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <ChatInput onSendMessage={handleSendMessage} theme="blue" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-center mt-3 text-blue-500/50"
            >
              Gemini dapat membuat kesalahan. Pertimbangkan untuk memeriksa informasi penting.
            </motion.p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default GeminiContainer; 