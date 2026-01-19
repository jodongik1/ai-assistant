import MessageItem from './MessageItem';

const MessageList = ({ messages, isDarkMode, scrollRef }) => {
  return (
    <main 
      className="flex-1 overflow-y-auto px-4 py-8 md:px-[15%] lg:px-[20%] space-y-10" 
      ref={scrollRef}
    >
      {/* 메시지가 없을 때 표시되는 초기 화면 */}
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-20">
          <h1 className="text-5xl font-bold mb-4 italic leading-tight text-gemini-text">
            How can I help you?
          </h1>
          <p>Qwen 2.5 Coder AI Assistant</p>
        </div>
      ) : (
        /* 메시지 배열을 순회하며 개별 메시지 아이템 렌더링 */
        messages.map((msg, idx) => (
          <MessageItem 
            key={idx} 
            msg={msg} 
            isDarkMode={isDarkMode} 
          />
        ))
      )}
    </main>
  );
};

export default MessageList;