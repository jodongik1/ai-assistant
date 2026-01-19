import { useState } from 'react';
import { Send, Square } from 'lucide-react';

const ChatInput = ({ onSend, onStop, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <footer className="p-4 md:px-[15%] lg:px-[20%] pb-10 pt-2 bg-gemini-bg shrink-0">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex flex-col bg-gemini-input rounded-3xl border border-gemini-border focus-within:ring-2 focus-within:ring-blue-600/30 shadow-2xl overflow-hidden transition-all">
        <textarea
          className="w-full bg-transparent py-5 px-7 focus:outline-none resize-none min-h-[100px] max-h-[300px] text-lg leading-relaxed text-gemini-text placeholder:text-gray-500"
          placeholder="메시지를 입력하세요..."
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex justify-end p-4 pt-0">
          {!isLoading ? (
            <button 
              type="submit" 
              disabled={!input.trim()}
              className={`p-2.5 rounded-2xl transition-all ${
                input.trim() 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 active:scale-90 hover:bg-blue-500' 
                  : 'text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={22} strokeWidth={2.5} />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={onStop} 
              className="group p-2.5 px-5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-red-500 border border-red-200 dark:border-red-900/30 flex items-center gap-2.5 shadow-xl transition-all hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <Square size={14} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
              <span className="text-xs font-bold tracking-wider uppercase">Stop</span>
            </button>
          )}
        </div>
      </form>
      <div className="text-center mt-3 text-[10px] text-gray-500">
        Powered by MLX Inference on Mac
      </div>
    </footer>
  );
};

export default ChatInput;