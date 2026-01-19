import { Plus, MessageSquare, Trash2 } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, history, currentId, onNewChat, onSelectChat, onDeleteChat }) => {
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'
      }`}>
        <div className="p-4 shrink-0">
          <button onClick={() => { onNewChat(); onClose(); }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 text-sm font-medium text-white transition-all active:scale-95">
            <Plus size={18} /> 새 채팅
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">최근 대화</div>
          {history.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => { onSelectChat(chat); onClose(); }} 
              className={`flex items-center justify-between gap-2 px-3 py-3 rounded-lg text-sm cursor-pointer group ${
                currentId === chat.id ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800/40 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <MessageSquare size={16} />
                <span className="truncate">{chat.title}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>
      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />}
    </>
  );
};

export default Sidebar;