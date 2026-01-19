import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, value, isDarkMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group my-4 rounded-xl overflow-hidden border ${
      isDarkMode ? 'border-gray-700/50 shadow-2xl' : 'border-gray-300 shadow-md'
    }`}>
      <div className={`flex justify-between items-center px-4 py-2 text-xs font-mono ${
        isDarkMode ? 'bg-[#212121] text-gray-400' : 'bg-gray-100 text-gray-600'
      }`}>
        <span>{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 hover:opacity-70 transition-colors cursor-pointer">
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter 
        language={language || 'text'} 
        style={isDarkMode ? oneDark : oneLight} 
        customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.875rem' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;