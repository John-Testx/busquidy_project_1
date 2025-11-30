import React from 'react';
import { useNewChatModal } from '@/hooks';
import { X, Search, MessageCircle, User } from 'lucide-react';

const NewChatModal = ({ isOpen, onClose, onConversationStarted }) => {
  const {
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    filteredUsers,
    startConversation
  } = useNewChatModal(isOpen);

  const handleStartConversation = async (otherUserId) => {
    const result = await startConversation(otherUserId);
    if (result.success) {
      onConversationStarted(result.data);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md overflow-y-auto h-full w-full flex justify-center items-center z-50 p-3 md:p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative animate-[modalSlideIn_0.3s_ease-out] overflow-hidden mx-auto">
        {/* Header mejorado */}
        <div className="bg-gradient-to-br from-[#07767c] via-[#088890] to-[#0a9199] px-6 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">Nueva Conversación</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-2xl w-10 h-10 flex items-center justify-center transition-all duration-200 hover:rotate-90 relative z-10"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Search mejorado */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por correo..."
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-[#07767c]/30 focus:border-[#07767c] transition-all text-gray-800 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="text-center py-12">
              <div className="w-14 h-14 border-4 border-[#07767c]/20 border-t-[#07767c] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Cargando usuarios...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 rounded-2xl">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto space-y-2 custom-scrollbar">
            {!isLoading && !error && filteredUsers().length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Search className="w-10 h-10 text-gray-500" />
                </div>
                <p className="text-gray-600 font-medium mb-1">No se encontraron usuarios</p>
                <p className="text-sm text-gray-500">Intenta con otro término de búsqueda</p>
              </div>
            )}
            
            {filteredUsers().map(user => (
              <div
                key={user.id_usuario}
                className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-2xl cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-[#07767c]/20 group"
                onClick={() => handleStartConversation(user.id_usuario)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#07767c]/20 to-[#0a9199]/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-[#07767c]/30 group-hover:to-[#0a9199]/30 transition-all shadow-md">
                    <span className="text-[#07767c] font-bold text-xl">
                      {user.correo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{user.correo}</p>
                    <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
                      <User size={14} />
                      {user.tipo_usuario}
                    </p>
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-xl text-sm font-bold hover:from-[#055a5f] hover:to-[#077d84] transition-all shadow-lg hover:shadow-xl flex-shrink-0">
                  Chatear
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;