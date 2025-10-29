import React, { useState } from 'react';
import NewChatModal from '@/components/Chat/NewChatModal';
import { MessageSquare, Search, Plus } from 'lucide-react';

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  setSelectedConversation,
  searchTerm,
  setSearchTerm,
  sortedConversations,
  getOtherUserInfo,
  handleNewConversation,
  id_usuario
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onNewConversation = (newConv) => {
    setIsModalOpen(false);
    handleNewConversation(newConv);
  };

  const displayConversations = sortedConversations();

  return (
    <aside className="w-full flex flex-col bg-white border-r border-gray-200 shadow-lg rounded-l-xl md:rounded-l-2xl overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-3 md:p-4 bg-gradient-to-r from-[#07767c] to-[#0a9199] border-b border-[#055a5f] rounded-tl-xl md:rounded-tl-2xl">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white">Mensajes</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 md:p-2.5 rounded-lg md:rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 group"
            title="Nuevo Mensaje"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-white/60" />
          <input 
            type="text" 
            placeholder="Buscar conversación..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg md:rounded-xl text-sm md:text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/25 transition-all"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {displayConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#07767c]/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-[#07767c]/40" />
            </div>
            <p className="text-gray-500 text-xs md:text-sm">
              {searchTerm ? 'No se encontraron conversaciones' : 'No tienes conversaciones aún'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 md:mt-4 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-lg text-xs md:text-sm font-medium hover:from-[#055a5f] hover:to-[#077d84] transition-all"
              >
                Iniciar conversación
              </button>
            )}
          </div>
        ) : (
          displayConversations.map(conv => {
            const otherUser = getOtherUserInfo(conv);
            const isActive = selectedConversation?.id_conversation === conv.id_conversation;
            
            return (
              <div
                key={conv.id_conversation}
                onClick={() => setSelectedConversation(conv)}
                className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#07767c]/10 to-transparent border-[#07767c]' 
                    : 'hover:bg-gray-50 border-transparent'
                }`}
              >
                {/* Avatar */}
                <div className={`relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-base md:text-lg ${
                  isActive 
                    ? 'bg-gradient-to-br from-[#07767c] to-[#0a9199] text-white ring-2 ring-[#07767c]/20' 
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700'
                }`}>
                  {otherUser.email ? otherUser.email.charAt(0).toUpperCase() : '?'}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5 md:mb-1">
                    <p className={`font-semibold text-sm md:text-base truncate ${
                      isActive ? 'text-[#07767c]' : 'text-gray-800'
                    }`}>
                      {otherUser.email || 'Usuario desconocido'}
                    </p>
                    {conv.last_message_time && (
                      <span className="text-[10px] md:text-xs text-gray-500 ml-2 flex-shrink-0">
                        {new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs md:text-sm truncate ${
                    isActive ? 'text-[#07767c]/70' : 'text-gray-500'
                  }`}>
                    {conv.last_message || "Inicia una conversación"}
                  </p>
                </div>

                {/* Unread badge */}
                {!isActive && conv.unread_count > 0 && (
                  <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-[#07767c] text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center">
                    {conv.unread_count}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConversationStarted={onNewConversation}
      />
    </aside>
  );
};

export default ConversationList;