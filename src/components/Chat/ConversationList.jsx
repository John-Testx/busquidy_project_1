import React, { useState, useEffect } from 'react';
import { getConversations } from '../../api/chatApi';
import useAuth from '../../hooks/useAuth';
import NewChatModal from './NewChatModal';
import { MessageSquare, Search, Plus } from 'lucide-react';

const ConversationList = ({ conversations, setConversations, setSelectedConversation, selectedConversation }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { id_usuario } = useAuth();

    useEffect(() => {
        const fetchInitialConversations = async () => {
            try {
                const { data } = await getConversations();
                setConversations(data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };
        fetchInitialConversations();
    }, [setConversations]);

    const handleNewConversation = (newConv) => {
        setIsModalOpen(false);
        if (!conversations.some(c => c.id_conversation === newConv.id_conversation)) {
            setConversations(prev => [newConv, ...prev]);
        }
        setSelectedConversation(newConv);
    };

    const filteredConversations = conversations.filter(conv => {
        const otherUserEmail = conv.user_one_id === id_usuario ? conv.user_two_email : conv.user_one_email;
        return otherUserEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-white border-r border-gray-200 shadow-lg">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#07767c] to-[#0a9199] border-b border-[#055a5f]">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Mensajes</h2>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 group"
                        title="Nuevo Mensaje"
                    >
                        <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                    <input 
                        type="text" 
                        placeholder="Buscar conversación..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/25 transition-all"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="w-16 h-16 bg-[#07767c]/10 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-[#07767c]/40" />
                        </div>
                        <p className="text-gray-500 text-sm">
                            {searchTerm ? 'No se encontraron conversaciones' : 'No tienes conversaciones aún'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 px-4 py-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-lg text-sm font-medium hover:from-[#055a5f] hover:to-[#077d84] transition-all"
                            >
                                Iniciar conversación
                            </button>
                        )}
                    </div>
                ) : (
                    filteredConversations
                        .sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time))
                        .map(conv => {
                            const otherUser = conv.user_one_id === id_usuario
                                ? { id: conv.user_two_id, email: conv.user_two_email }
                                : { id: conv.user_one_id, email: conv.user_one_email };
                            
                            const isActive = selectedConversation?.id_conversation === conv.id_conversation;

                            return (
                                <div
                                    key={conv.id_conversation}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-[#07767c]/10 to-transparent border-[#07767c]' 
                                            : 'hover:bg-gray-50 border-transparent'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                        isActive 
                                            ? 'bg-gradient-to-br from-[#07767c] to-[#0a9199] text-white ring-2 ring-[#07767c]/20' 
                                            : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700'
                                    }`}>
                                        {otherUser.email ? otherUser.email.charAt(0).toUpperCase() : '?'}
                                        {/* Online indicator */}
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <p className={`font-semibold truncate ${
                                                isActive ? 'text-[#07767c]' : 'text-gray-800'
                                            }`}>
                                                {otherUser.email || 'Usuario desconocido'}
                                            </p>
                                            {conv.last_message_time && (
                                                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                                    {new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm truncate ${
                                            isActive ? 'text-[#07767c]/70' : 'text-gray-500'
                                        }`}>
                                            {conv.last_message || "Inicia una conversación"}
                                        </p>
                                    </div>

                                    {/* Unread badge (opcional) */}
                                    {!isActive && conv.unread_count > 0 && (
                                        <div className="flex-shrink-0 w-6 h-6 bg-[#07767c] text-white text-xs font-bold rounded-full flex items-center justify-center">
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
                onConversationStarted={handleNewConversation}
            />
        </aside>
    );
};

export default ConversationList;