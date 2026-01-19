import { Menu, Sun, Moon } from 'lucide-react';

const Header = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  messages, 
  currentChatTitle, 
  isDarkMode, 
  toggleTheme 
}) => {
  return (
    <header className="p-4 flex items-center gap-4 border-b border-gemini-border bg-gemini-bg/90 backdrop-blur-xl shrink-0 z-20">
      {/* 사이드바 토글 버튼 */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
      >
        <Menu size={22} />
      </button>
      
      {/* 제목 표시 영역 */}
      <div className="flex items-center gap-3 font-medium truncate">
        <span className="truncate text-sm md:text-base">
          {messages.length === 0 ? "AI Code Assistant" : currentChatTitle}
        </span>
      </div>

      {/* 테마 전환 버튼 */}
      <button 
        onClick={toggleTheme} 
        className="ml-auto p-2.5 rounded-xl border border-gemini-border hover:bg-black/5 dark:hover:bg-white/5 transition-all"
      >
        {isDarkMode ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-blue-600" />
        )}
      </button>
    </header>
  );
};

export default Header;