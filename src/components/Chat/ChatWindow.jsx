import React, { useState, useEffect, useRef } from 'react';
import { getMessages } from '../../api/chatApi';
import useAuth from '../../hooks/useAuth';
import { Send, MoreVertical, Phone, Video, Info } from 'lucide-react';

const ChatWindow = ({ conversation, messages, setMessages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const { id_usuario } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (conversation) {
            const fetchMessages = async () => {
                try {
                    const response = await getMessages(conversation.id_conversation);
                    setMessages(response.data);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            };
            fetchMessages();
        }
    }, [conversation, setMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!conversation) {
        return (
            <div className="w-2/3 flex-col h-full hidden md:flex items-center justify-center bg-white">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#07767c]/20 to-[#0a9199]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-[#07767c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Bienvenido a Mensajes</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Selecciona una conversación de la lista o inicia una nueva para comenzar a chatear con otros usuarios.
                    </p>
                </div>
            </div>
        );
    }

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    const otherUserEmail = conversation.user_one_id === id_usuario ? conversation.user_two_email : conversation.user_one_email;

    return (
        <div className="w-2/3 flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#07767c] to-[#0a9199] border-b border-[#055a5f] shadow-md">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-white text-lg ring-2 ring-white/30">
                            {otherUserEmail.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#07767c] rounded-full"></span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-white text-lg">{otherUserEmail}</h2>
                        <p className="text-xs text-white/80 flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            En línea
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Llamada de voz">
                        <Phone className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Videollamada">
                        <Video className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Información">
                        <Info className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Más opciones">
                        <MoreVertical className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-sm">No hay mensajes aún. ¡Inicia la conversación!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwnMessage = msg.id_sender === id_usuario;
                        const showAvatar = index === 0 || messages[index - 1]?.id_sender !== msg.id_sender;
                        
                        return (
                            <div key={msg.id_message} className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                {!isOwnMessage && showAvatar && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center font-semibold text-gray-700 text-xs flex-shrink-0">
                                        {otherUserEmail.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {!isOwnMessage && !showAvatar && <div className="w-8" />}
                                
                                <div className={`max-w-xs md:max-w-md ${isOwnMessage ? '' : 'order-2'}`}>
                                    <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                                        isOwnMessage 
                                            ? 'bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-br-md' 
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                                    }`}>
                                        <p className="text-sm leading-relaxed break-words">{msg.message_text}</p>
                                    </div>
                                    <span className={`block text-xs mt-1 ${isOwnMessage ? 'text-right text-gray-500' : 'text-left text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            className="w-full pl-4 pr-12 py-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#07767c]/30 focus:border-[#07767c] focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                    </div>
                    
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="p-3.5 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-xl hover:from-[#055a5f] hover:to-[#077d84] focus:outline-none focus:ring-2 focus:ring-[#07767c]/30 focus:ring-offset-2 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center"
                        title="Enviar mensaje"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;