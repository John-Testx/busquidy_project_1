import React, { useState } from 'react';
import { Search, MessageSquarePlus, User, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewChatModal from './NewChatModal';

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
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-CL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white border-r border-gray-200">
        {/* Header mejorado */}
        <div className="p-5 bg-gradient-to-br from-[#07767c] via-[#088890] to-[#0a9199] text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
          
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div>
              <h2 className="text-2xl font-bold mb-1">Mensajes</h2>
              <p className="text-teal-100 text-sm">{conversations.length} conversaciones</p>
            </div>
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              title="Nueva conversación"
            >
              <MessageSquarePlus size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Search mejorado */}
          <div className="relative z-10">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg transition-all duration-200"
            />
          </div>
        </div>

        {/* Conversations List mejorada */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sortedConversations().length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                <User size={48} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">No hay conversaciones</h3>
              <p className="text-gray-500 text-sm mb-4">Comienza a chatear con alguien nuevo</p>
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-2xl hover:from-[#055a5f] hover:to-[#077d84] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Iniciar conversación
              </button>
            </div>
          ) : (
            sortedConversations().map((conv) => {
              const otherUser = getOtherUserInfo(conv);
              const isSelected = selectedConversation?.id_conversation === conv.id_conversation;

              return (
                <Link
                  key={conv.id_conversation}
                  to={`/chat/${conv.id_conversation}`}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 ${
                    isSelected ? 'bg-gradient-to-r from-[#07767c]/10 to-[#0a9199]/10 border-l-4 border-l-[#07767c]' : ''
                  }`}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#07767c] to-[#0a9199] rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
                    {otherUser.email?.charAt(0).toUpperCase() || '?'}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-gray-900 truncate text-base">
                        {otherUser.email}
                      </h4>
                      <div className="flex items-center gap-1 text-gray-500 ml-2 flex-shrink-0">
                        <Clock size={14} />
                        <span className="text-xs font-medium">
                          {formatLastMessageTime(conv.last_message_time)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.last_message || 'Sin mensajes aún'}
                    </p>
                  </div>

                  <ChevronRight size={20} className={`flex-shrink-0 transition-all duration-200 ${isSelected ? 'text-[#07767c]' : 'text-gray-400'}`} />
                </Link>
              );
            })
          )}
        </div>
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onConversationStarted={handleNewConversation}
      />
    </>
  );
};

export default ConversationList;