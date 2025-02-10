import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { User, Bot, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Typewriter from 'typewriter-effect';
import { sanitizeInput } from '../../utils/sanitizer';

const ChatBubble = ({ message, isUser }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  const formatMarkdown = (text) => {
    text = text.replace(/###\s(.*)/g, '## $1');
    text = text.replace(/\*\*(.*?)\*\*/g, '**$1**');
    return text;
  };

  const sanitizedMessage = sanitizeInput(message);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative px-4 ${isUser ? 'bg-[#0c1716] mt-6' : 'bg-[#0c1716]'}`}
    >
      <div className={`flex gap-3 ${isUser ? 'max-w-[85%] ml-auto' : 'w-[95%] mr-auto'} items-end`}>
        {/* Avatar for bot messages */}
        {!isUser && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-emerald-800/20 border border-emerald-700/30">
            <Bot className="h-4 w-4 text-emerald-400" />
          </div>
        )}

        {/* Message */}
        <div className={`flex ${isUser ? 'justify-end w-full' : 'w-full'} ${isUser ? 'order-first' : 'order-none'}`}>
          <div className={`relative prose prose-invert max-w-[300px] ${
            isUser ? 'bg-emerald-800/20 border-emerald-800/20' : 'bg-[#0f1f1d] border-emerald-800/20'
          } border rounded-2xl px-4 py-2 ${
            isUser ? 'rounded-br-sm' : 'rounded-bl-sm'
          } shadow-sm`}>
            <div className="flex items-center gap-2 mb-1">
              {isUser ? (
                <div className="flex items-center gap-2 justify-end w-full">
                  <p className="font-medium text-xs text-emerald-500/70">Anda</p>
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full overflow-hidden bg-emerald-800/20 border border-emerald-700/30">
                    <User className="h-3 w-3 text-emerald-400" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full overflow-hidden bg-emerald-800/20 border border-emerald-700/30">
                    <Bot className="h-3 w-3 text-emerald-400" />
                  </div>
                  <p className="font-medium text-xs text-emerald-500/70">Zyra</p>
                </div>
              )}
            </div>
            {isUser ? (
              <div className="break-all overflow-hidden">
                <Typewriter
                  options={{
                    delay: 30,
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
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-emerald-50" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-emerald-50" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-emerald-50" {...props} />,
                  p: ({ node, ...props }) => <p className={`leading-relaxed mb-4 ${isUser ? 'text-emerald-300/90' : 'text-emerald-300/90'}`} {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />,
                  li: ({ node, ...props }) => <li className={isUser ? 'text-emerald-300/90' : 'text-emerald-300/90'} {...props} />,
                  code: ({ node, inline, ...props }) => 
                    inline ? (
                      <code className="inline-block min-w-[50px] bg-[#0c1716] px-1.5 py-0.5 rounded text-emerald-300 text-sm border border-emerald-800/20 break-words whitespace-pre-wrap" {...props} />
                    ) : (
                      <div className="relative w-full">
                        <code className="block min-w-[200px] bg-[#0c1716] p-4 rounded-lg text-sm border border-emerald-800/20 overflow-x-auto whitespace-pre-wrap break-words max-w-full" {...props} />
                      </div>
                    ),
                  pre: ({ node, ...props }) => (
                    <pre className="min-w-[200px] bg-[#0c1716] p-4 rounded-lg border border-emerald-800/20 overflow-x-auto whitespace-pre-wrap break-words max-w-full" {...props} />
                  ),
                  strong: ({ node, ...props }) => <strong className="font-semibold text-emerald-200" {...props} />,
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
  message: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
};

export default ChatBubble;