import { useState, useEffect, useRef } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  const abortControllerRef = useRef(null);

  // 로드 시 히스토리 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChatHistory(parsed);
      if (parsed.length > 0) {
        setMessages(parsed[0].messages);
        setCurrentChatId(parsed[0].id);
      }
    }
  }, []);

  // 메시지 변경 시 히스토리 저장
  useEffect(() => {
    if (messages.length > 0) {
      setChatHistory(prev => {
        const existingIdx = prev.findIndex(chat => chat.id === currentChatId);
        let newHistory;
        const title = messages[0].content.slice(0, 30);
        if (existingIdx > -1) {
          newHistory = [...prev];
          newHistory[existingIdx].messages = messages;
          newHistory[existingIdx].title = title;
        } else {
          newHistory = [{
            id: currentChatId,
            title,
            messages,
            timestamp: new Date().toISOString()
          }, ...prev];
        }
        localStorage.setItem('chat_history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [messages, currentChatId]);

  const sendMessage = async (input) => {
    if (!input.trim() || isLoading) return;

    abortControllerRef.current = new AbortController();
    setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'bot', content: '' }]);
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
            } catch (e) { console.error(e); }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopResponse = () => abortControllerRef.current?.abort();

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(Date.now());
  };

  const selectChat = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
  };

  const deleteChat = (chatId) => {
    const newHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(newHistory);
    localStorage.setItem('chat_history', JSON.stringify(newHistory));
    if (currentChatId === chatId) startNewChat();
  };

  return {
    messages, isLoading, chatHistory, currentChatId,
    sendMessage, stopResponse, startNewChat, selectChat, deleteChat
  };
};