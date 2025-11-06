import React, { useState } from 'react';
import { Search, MessageSquarePlus, User, ChevronRight } from 'lucide-react';
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
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Mensajes</h2>
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Nueva conversación"
            >
              <MessageSquarePlus size={22} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={18} 
            />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {sortedConversations().length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <User size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500">No hay conversaciones</p>
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="mt-4 px-4 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#055a5f] transition-colors"
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
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    isSelected ? 'bg-[#07767c]/5 border-l-4 border-l-[#07767c]' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#0a9199] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {otherUser.email?.charAt(0).toUpperCase() || '?'}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {otherUser.email}
                      </h4>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatLastMessageTime(conv.last_message_time)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.last_message || 'Inicia la conversación'}
                    </p>
                  </div>

                  <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Modal para nueva conversación */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onConversationStarted={handleNewConversation}
      />
    </>
  );
};

export default ConversationList;