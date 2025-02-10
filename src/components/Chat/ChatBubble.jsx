import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { User, Bot, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Typewriter from 'typewriter-effect';

const ChatBubble = ({ message, isUser }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  const formatMarkdown = (text) => {
    text = text.replace(/###\s(.*)/g, '## $1');
    text = text.replace(/\*\*(.*?)\*\*/g, '**$1**');
    return text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative ${isUser ? 'bg-[#0c1716]' : 'bg-[#0c1716]'}`}
    >
      <div className={`flex gap-6 max-w-3xl mx-auto ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-lg overflow-hidden ${
          isUser ? 'bg-emerald-800/20 border border-emerald-700/30' : 'bg-emerald-800/20 border border-emerald-700/30'
        }`}>
          {isUser ? (
            <User className="h-5 w-5 text-emerald-400" />
          ) : (
            <Bot className="h-5 w-5 text-emerald-400" />
          )}
        </div>

        {/* Message */}
        <div className={`flex-1 space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} w-full`}>
            <p className="font-medium text-sm text-emerald-500/70">
              {isUser ? 'Anda' : 'Zyra'}
            </p>
            {!isUser && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-emerald-800/20 rounded-md"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 text-emerald-400" />
              </motion.button>
            )}
          </div>
          <div className={`prose prose-invert max-w-none ${
            isUser ? 'bg-[#0f1f1d] border border-emerald-800/20' : 'bg-[#0f1f1d] border border-emerald-800/20'
          } rounded-lg p-4 ${isUser ? 'text-emerald-300/90' : 'text-emerald-300/90'} shadow-lg backdrop-blur-xl`}>
            {isUser ? (
              <div className="prose prose-invert max-w-none">
                <Typewriter
                  options={{
                    delay: 30,
                    cursor: '',
                    strings: [message],
                    autoStart: true,
                    loop: true,
                    skipAddStyles: false,
                    deleteSpeed: null
                  }}
                />
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-emerald-50" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-emerald-50" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-emerald-50" {...props} />,
                  p: ({ node, ...props }) => <p className={`leading-relaxed mb-4 ${isUser ? 'text-emerald-300/90' : 'text-emerald-300/90'}`} {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />,
                  li: ({ node, ...props }) => <li className={isUser ? 'text-emerald-300/90' : 'text-emerald-300/90'} {...props} />,
                  code: ({ node, inline, ...props }) => 
                    inline ? (
                      <code className="bg-[#0c1716] px-1.5 py-0.5 rounded text-emerald-300 text-sm border border-emerald-800/20" {...props} />
                    ) : (
                      <code className="block bg-[#0c1716] p-4 rounded-lg text-sm overflow-x-auto border border-emerald-800/20" {...props} />
                    ),
                  pre: ({ node, ...props }) => <pre className="bg-[#0c1716] p-4 rounded-lg border border-emerald-800/20 overflow-x-auto" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold text-emerald-200" {...props} />,
                }}
              >
                {formatMarkdown(message)}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
};

export default ChatBubble;