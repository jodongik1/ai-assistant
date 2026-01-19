import { useState, useRef, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import { useTheme } from './hooks/useTheme';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header';
import MessageList from './components/Chat/MessageList';
import ChatInput from './components/Chat/ChatInput';

function App() {
  // 커스텀 훅을 통한 상태 관리
  const { isDarkMode, toggleTheme } = useTheme();
  const { 
    messages, 
    isLoading, 
    chatHistory, 
    currentChatId, 
    sendMessage, 
    stopResponse, 
    startNewChat, 
    selectChat, 
    deleteChat 
  } = useChat();
  
  // UI 상태 및 참조
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef(null);

  // 자동 스크롤 로직
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 현재 채팅 제목 찾기
  const currentChatTitle = chatHistory.find(c => c.id === currentChatId)?.title || "새 대화";

  return (
    <div className={`h-screen flex overflow-hidden transition-colors duration-300 relative ${
      isDarkMode ? 'bg-gemini-bg text-gemini-text' : 'light-theme bg-gemini-bg text-gemini-text'
    }`}>
      
      {/* 사이드바 영역 */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        history={chatHistory}
        currentId={currentChatId}
        onNewChat={startNewChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col relative min-w-0 w-full">
        
        {/* 분리된 헤더 컴포넌트 */}
        <Header 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          messages={messages}
          currentChatTitle={currentChatTitle}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {/* 메시지 출력 영역 */}
        <MessageList 
          messages={messages} 
          isDarkMode={isDarkMode} 
          scrollRef={scrollRef} 
        />

        {/* 입력 영역 */}
        <ChatInput 
          onSend={sendMessage} 
          onStop={stopResponse} 
          isLoading={isLoading} 
        />
        
      </div>
    </div>
  );
}

export default App;