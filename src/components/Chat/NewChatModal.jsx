import React from 'react';
import { useNewChatModal } from '@/hooks';
import { X, Search, MessageCircle } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center z-50 p-3 md:p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-lg relative animate-[modalSlideIn_0.3s_ease-out] overflow-hidden mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#07767c] to-[#0a9199] px-4 md:px-6 py-4 md:py-5 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">Nueva Conversación</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-all duration-200 hover:rotate-90"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por correo..."
              className="w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 border border-gray-300 rounded-lg md:rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#07767c]/30 focus:border-[#07767c] focus:bg-white transition-all text-sm md:text-base text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {isLoading && (
            <div className="text-center py-8 md:py-12">
              <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#07767c]/20 border-t-[#07767c] rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
              <p className="text-gray-600 text-sm md:text-base">Cargando usuarios...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 rounded-lg">
              <p className="text-red-700 text-xs md:text-sm">{error}</p>
            </div>
          )}

          <div className="max-h-60 md:max-h-80 overflow-y-auto space-y-1.5 md:space-y-2">
            {!isLoading && !error && filteredUsers().length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Search className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm md:text-base">No se encontraron usuarios.</p>
              </div>
            )}
            
            {filteredUsers().map(user => (
              <div
                key={user.id_usuario}
                className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-lg md:rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-[#07767c]/20 group"
                onClick={() => handleStartConversation(user.id_usuario)}
              >
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#07767c]/20 to-[#0a9199]/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-[#07767c]/30 group-hover:to-[#0a9199]/30 transition-all">
                    <span className="text-[#07767c] font-bold text-base md:text-lg">
                      {user.correo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate text-sm md:text-base">{user.correo}</p>
                    <p className="text-xs md:text-sm text-gray-500 capitalize">{user.tipo_usuario}</p>
                  </div>
                </div>
                <button className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-lg text-xs md:text-sm font-medium hover:from-[#055a5f] hover:to-[#077d84] transition-all shadow-md hover:shadow-lg flex-shrink-0">
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