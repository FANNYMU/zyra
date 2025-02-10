import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { User, Bot, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Typewriter from 'typewriter-effect';
import { sanitizeInput } from '../../utils/sanitizer';

const ChatBubble = ({ message, isUser, theme = 'emerald' }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(typeof message === 'object' ? message.text : message);
  };

  const formatMarkdown = (text) => {
    text = text.replace(/###\s(.*)/g, '## $1');
    text = text.replace(/\*\*(.*?)\*\*/g, '**$1**');
    return text;
  };

  const messageText = typeof message === 'object' ? message.text : message;
  const messageImage = typeof message === 'object' ? message.image : null;
  const sanitizedMessage = sanitizeInput(messageText);

  const themeColors = {
    emerald: {
      bg: 'bg-[#0c1716]',
      bubbleBg: isUser ? 'bg-emerald-800/20' : 'bg-[#0f1f1d]',
      border: 'border-emerald-800/20',
      text: 'text-emerald-300/90',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-800/20',
      iconBorder: 'border-emerald-700/30',
      hover: 'hover:bg-emerald-800/10',
      hoverBorder: 'hover:border-emerald-700/30'
    },
    blue: {
      bg: 'bg-[#0c1620]',
      bubbleBg: isUser ? 'bg-blue-800/20' : 'bg-[#0f1f2d]',
      border: 'border-blue-800/20',
      text: 'text-blue-300/90',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-800/20',
      iconBorder: 'border-blue-700/30',
      hover: 'hover:bg-blue-800/10',
      hoverBorder: 'hover:border-blue-700/30'
    }
  };

  const colors = themeColors[theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative px-4 ${isUser ? colors.bg + ' mt-6' : colors.bg}`}
    >
      <div className={`flex gap-3 ${isUser ? 'max-w-[85%] ml-auto' : 'w-[95%] mr-auto'} items-end`}>
        {/* Avatar for bot messages */}
        {!isUser && (
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden ${colors.iconBg} border ${colors.iconBorder}`}>
            <Bot className={`h-4 w-4 ${colors.icon}`} />
          </div>
        )}

        {/* Message */}
        <div className={`flex ${isUser ? 'justify-end w-full' : 'w-full'} ${isUser ? 'order-first' : 'order-none'}`}>
          <div className={`relative prose prose-invert max-w-[300px] ${
            isUser ? colors.bubbleBg + ' ' + colors.border : colors.bubbleBg + ' ' + colors.border
          } border rounded-2xl px-4 py-2 ${
            isUser ? 'rounded-br-sm' : 'rounded-bl-sm'
          } shadow-sm`}>
            <div className="flex items-center gap-2 mb-1">
              {isUser ? (
                <div className="flex items-center gap-2 justify-end w-full">
                  <p className={`font-medium text-xs ${colors.text}`}>Anda</p>
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full overflow-hidden ${colors.iconBg} border ${colors.iconBorder}`}>
                    <User className={`h-3 w-3 ${colors.icon}`} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full overflow-hidden ${colors.iconBg} border ${colors.iconBorder}`}>
                    <Bot className={`h-3 w-3 ${colors.icon}`} />
                  </div>
                  <p className={`font-medium text-xs ${colors.text}`}>{theme === 'emerald' ? 'Zyra' : 'Gemini'}</p>
                </div>
              )}
            </div>
            
            {messageImage && (
              <div className="mb-2">
                <img 
                  src={messageImage} 
                  alt="Uploaded" 
                  className={`w-full h-auto max-h-[200px] object-cover rounded-lg border ${colors.border}`}
                />
              </div>
            )}
            
            {isUser ? (
              <div className="break-all overflow-hidden">
                <Typewriter
                  options={{
                    delay: 40,
                    cursor: '',
                    strings: [sanitizedMessage],
                    autoStart: true,
                    loop: true,
                    skipAddStyles: false,
                    deleteSpeed: null
                  }}
                />
              </div>
            ) : (
              <ReactMarkdown
                className="break-words whitespace-pre-wrap"
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-white" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-white" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-white" {...props} />,
                  p: ({ node, ...props }) => <p className={`leading-relaxed mb-4 ${colors.text}`} {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />,
                  li: ({ node, ...props }) => <li className={colors.text} {...props} />,
                  code: ({ node, inline, ...props }) => 
                    inline ? (
                      <code className={`inline-block min-w-[50px] ${colors.bg} px-1.5 py-0.5 rounded ${colors.text} text-sm border ${colors.border} break-words whitespace-pre-wrap`} {...props} />
                    ) : (
                      <div className="relative w-full">
                        <code className={`block min-w-[200px] ${colors.bg} p-4 rounded-lg text-sm border ${colors.border} overflow-x-auto whitespace-pre-wrap break-words max-w-full`} {...props} />
                      </div>
                    ),
                  pre: ({ node, ...props }) => (
                    <pre className={`min-w-[200px] ${colors.bg} p-4 rounded-lg border ${colors.border} overflow-x-auto whitespace-pre-wrap break-words max-w-full`} {...props} />
                  ),
                  strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                }}
              >
                {formatMarkdown(sanitizedMessage)}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      image: PropTypes.string
    })
  ]).isRequired,
  isUser: PropTypes.bool.isRequired,
  theme: PropTypes.string,
};

export default ChatBubble;