import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '../CodeBlock';

const MessageItem = ({ msg, isDarkMode }) => {
  return (
    <div className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
        msg.role === 'user' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gemini-input border-gemini-border text-blue-400'
      }`}>
        {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className={`max-w-[calc(100%-60px)] ${
        msg.role === 'user' ? 'bg-gemini-input p-4 rounded-2xl border border-gemini-border shadow-sm' : 'w-full text-gemini-text'
      }`}>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown 
            components={{ 
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock 
                    language={match[1]} 
                    value={String(children).replace(/\n$/, '')} 
                    isDarkMode={isDarkMode} 
                    {...props} 
                  />
                ) : (
                  <code className="bg-gemini-input px-1.5 py-0.5 rounded text-sm font-mono border border-gemini-border" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;