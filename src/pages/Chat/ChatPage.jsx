import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import useAuth from '../../hooks/useAuth';
import ConversationList from '../../components/Chat/ConversationList';
import ChatWindow from '../../components/Chat/ChatWindow';
import Navbar from '../../components/Home/Navbar';
import { getConversations } from '../../api/chatApi';

const SOCKET_SERVER_URL = "http://localhost:3001";

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const { id_usuario } = useAuth();
    const socket = useRef(null);

    useEffect(() => {
        if (!id_usuario) return;
        socket.current = io(SOCKET_SERVER_URL);
        return () => socket.current?.disconnect();
    }, [id_usuario]);

    useEffect(() => {
        if (selectedConversation?.id_conversation && socket.current) {
            socket.current.emit('join_chat_room', selectedConversation.id_conversation);
            setMessages([]);
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (!socket.current) return;
        const handleReceiveMessage = (newMessage) => {
            if (selectedConversation?.id_conversation === newMessage.id_conversation) {
                setMessages(prev => [...prev, newMessage]);
            }
            setConversations(prevConvs =>
                prevConvs.map(conv =>
                    conv.id_conversation === newMessage.id_conversation
                    ? { ...conv, last_message: newMessage.message_text, last_message_time: newMessage.created_at }
                    : conv
                ).sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time))
            );
        };
        socket.current.on('receive_message', handleReceiveMessage);
        return () => socket.current.off('receive_message', handleReceiveMessage);
    }, [selectedConversation, conversations]);
   
    const handleSendMessage = (messageText) => {
        if (!selectedConversation || !messageText.trim() || !socket.current) return;
        const messageData = {
            id_conversation: selectedConversation.id_conversation,
            id_sender: id_usuario,
            message_text: messageText,
        };
        socket.current.emit('send_message', messageData);
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
            <Navbar />
           
            <main className="flex flex-1 overflow-hidden pt-navbar">
                <ConversationList
                    conversations={conversations}
                    setConversations={setConversations}
                    setSelectedConversation={setSelectedConversation}
                    selectedConversation={selectedConversation}
                />
                <ChatWindow
                    key={selectedConversation?.id_conversation}
                    conversation={selectedConversation}
                    messages={messages}
                    setMessages={setMessages}
                    onSendMessage={handleSendMessage}
                />
            </main>
        </div>
    );
};

export default ChatPage;