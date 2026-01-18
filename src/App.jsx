import { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Bot, Sparkles, Copy, Check, Square, 
  Menu, Plus, MessageSquare, Trash2, Sun, Moon 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  
  // 테마 상태 관리 (로컬 스토리지 연동)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme !== null ? JSON.parse(savedTheme) : true;
  });

  // 사이드바 개폐 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedStatus = localStorage.getItem('sidebar_open');
    return savedStatus !== null ? JSON.parse(savedStatus) : true;
  });

  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);

  // 설정값이 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
    localStorage.setItem('sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isDarkMode, isSidebarOpen]);

  // 컴포넌트 마운트 시 기존 대화 내역 불러오기
  useEffect(() => {
    const savedHistory = localStorage.getItem('chat_history');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setChatHistory(parsed);
      if (parsed.length > 0) {
        setMessages(parsed[0].messages);
        setCurrentChatId(parsed[0].id);
      }
    }
  }, []);

  // 대화 내용이 바뀔 때마다 히스토리 자동 저장
  useEffect(() => {
    if (messages.length > 0) {
      setChatHistory(prev => {
        const existingIdx = prev.findIndex(chat => chat.id === currentChatId);
        let newHistory;
        if (existingIdx > -1) {
          newHistory = [...prev];
          newHistory[existingIdx].messages = messages;
          newHistory[existingIdx].title = messages[0].content.slice(0, 30);
        } else {
          newHistory = [{
            id: currentChatId,
            title: messages[0].content.slice(0, 30),
            messages: messages,
            timestamp: new Date().toISOString()
          }, ...prev];
        }
        localStorage.setItem('chat_history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [messages, currentChatId]);

  // 새로운 메시지 수신 시 하단 스크롤
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(Date.now());
  };

  const deleteChat = (e, chatId) => {
    e.stopPropagation();
    const newHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(newHistory);
    localStorage.setItem('chat_history', JSON.stringify(newHistory));
    if (currentChatId === chatId) startNewChat();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    abortControllerRef.current = new AbortController();
    setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'bot', content: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
        signal: abortControllerRef.current.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              acc += data.text;
              setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1].content = acc;
                return newMsgs;
              });
            } catch (e) {
              console.error("Parsing error:", e);
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-screen flex overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-gemini-bg text-gemini-text' : 'light-theme bg-gemini-bg text-gemini-text'
    }`}>
      
      {/* Sidebar: 채팅 내역 관리 */}
      <aside className={`bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden border-none'
      }`}>
        <div className="p-4 shrink-0">
          <button onClick={startNewChat} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-sm font-medium text-white transition-all active:scale-95">
            <Plus size={18} /> 새 채팅
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">최근 대화</div>
          {chatHistory.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => {setMessages(chat.messages); setCurrentChatId(chat.id);}} 
              className={`flex items-center justify-between gap-2 px-3 py-3 rounded-lg text-sm cursor-pointer group ${
                currentChatId === chat.id ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800/40 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <MessageSquare size={16} />
                <span className="truncate">{chat.title}</span>
              </div>
              <button onClick={(e) => deleteChat(e, chat.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <header className="p-4 flex items-center gap-4 border-b border-gemini-border bg-gemini-bg/90 backdrop-blur-xl shrink-0 z-20">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3 font-medium text-gemini-text">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg">
              <Sparkles size={18} className="text-white" />
            </div>
            <span>AI Code Assistant</span>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="ml-auto p-2.5 rounded-xl border border-gemini-border hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90"
            title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-[15%] lg:px-[20%] space-y-10" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-20">
              <h1 className="text-5xl font-bold mb-4 italic leading-tight text-gemini-text">How can I help you?</h1>
              <p>Qwen 2.5 Coder AI Assistant</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
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
          ))}
        </main>

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
                  onClick={() => abortControllerRef.current?.abort()} 
                  className="p-2.5 rounded-xl bg-gray-800 text-red-500 border border-gray-700 flex items-center gap-2 px-4 shadow-xl active:scale-95"
                >
                  <Square size={16} fill="currentColor" /> 
                  <span className="text-xs font-bold uppercase">Stop</span>
                </button>
              )}
            </div>
          </form>
          <div className="text-center mt-3 text-[10px] text-gray-500">
            Powered by MLX Inference on Mac
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;