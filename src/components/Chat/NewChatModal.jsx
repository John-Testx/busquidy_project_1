import React from 'react';
import useNewChatModal from '@/hooks/useNewChatModal';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-[modalSlideIn_0.3s_ease-out] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#07767c] to-[#0a9199] px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Nueva Conversación</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por correo..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#07767c]/30 focus:border-[#07767c] focus:bg-white transition-all text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#07767c]/20 border-t-[#07767c] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando usuarios...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto space-y-2">
            {!isLoading && !error && filteredUsers().length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No se encontraron usuarios.</p>
              </div>
            )}
            
            {filteredUsers().map(user => (
              <div
                key={user.id_usuario}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-[#07767c]/20 group"
                onClick={() => handleStartConversation(user.id_usuario)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#07767c]/20 to-[#0a9199]/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-[#07767c]/30 group-hover:to-[#0a9199]/30 transition-all">
                    <span className="text-[#07767c] font-bold text-lg">
                      {user.correo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{user.correo}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.tipo_usuario}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-lg text-sm font-medium hover:from-[#055a5f] hover:to-[#077d84] transition-all shadow-md hover:shadow-lg flex-shrink-0">
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