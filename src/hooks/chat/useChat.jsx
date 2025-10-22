import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { getConversations, getMessages, getUsersForChat, createConversation } from '@/api/chatApi';
import { useAuth } from '@/hooks';

const SOCKET_SERVER_URL = "http://localhost:3001";

const useChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id_usuario } = useAuth();
  const socket = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!id_usuario) return;

    socket.current = io(SOCKET_SERVER_URL);

    return () => {
      socket.current?.disconnect();
    };
  }, [id_usuario]);

  // Join chat room when conversation is selected
  useEffect(() => {
    if (selectedConversation?.id_conversation && socket.current) {
      socket.current.emit('join_chat_room', selectedConversation.id_conversation);
      setMessages([]);
    }
  }, [selectedConversation]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket.current) return;

    const handleReceiveMessage = (newMessage) => {
      // Add message to current conversation
      if (selectedConversation?.id_conversation === newMessage.id_conversation) {
        setMessages(prev => [...prev, newMessage]);
      }

      // Update conversation list with latest message
      setConversations(prevConvs =>
        prevConvs.map(conv =>
          conv.id_conversation === newMessage.id_conversation
            ? { ...conv, last_message: newMessage.message_text, last_message_time: newMessage.created_at }
            : conv
        ).sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time))
      );
    };

    socket.current.on('receive_message', handleReceiveMessage);

    return () => {
      socket.current.off('receive_message', handleReceiveMessage);
    };
  }, [selectedConversation]);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversations();
        setConversations(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("No se pudieron cargar las conversaciones");
      } finally {
        setLoading(false);
      }
    };

    if (id_usuario) {
      fetchConversations();
    }
  }, [id_usuario]);

  // Fetch messages for selected conversation
  const fetchMessagesForConversation = useCallback(async (conversationId) => {
    try {
      const response = await getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("No se pudieron cargar los mensajes");
    }
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversation?.id_conversation) {
      fetchMessagesForConversation(selectedConversation.id_conversation);
    }
  }, [selectedConversation, fetchMessagesForConversation]);

  // Send message
  const sendMessage = useCallback((messageText) => {
    if (!selectedConversation || !messageText.trim() || !socket.current) return;

    const messageData = {
      id_conversation: selectedConversation.id_conversation,
      id_sender: id_usuario,
      message_text: messageText,
    };

    socket.current.emit('send_message', messageData);
  }, [selectedConversation, id_usuario]);

  // Get other user's email
  const getOtherUserEmail = useCallback((conversation = selectedConversation) => {
    if (!conversation || !id_usuario) return '';
    
    return conversation.user_one_id === id_usuario 
      ? conversation.user_two_email 
      : conversation.user_one_email;
  }, [selectedConversation, id_usuario]);

  // Get other user info
  const getOtherUserInfo = useCallback((conversation) => {
    if (!conversation || !id_usuario) return { id: null, email: '' };
    
    return conversation.user_one_id === id_usuario
      ? { id: conversation.user_two_id, email: conversation.user_two_email }
      : { id: conversation.user_one_id, email: conversation.user_one_email };
  }, [id_usuario]);

  // Filter conversations by search term
  const filteredConversations = useCallback(() => {
    return conversations.filter(conv => {
      const otherUserEmail = getOtherUserEmail(conv);
      return otherUserEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm, getOtherUserEmail]);

  // Handle new conversation
  const handleNewConversation = useCallback((newConv) => {
    if (!conversations.some(c => c.id_conversation === newConv.id_conversation)) {
      setConversations(prev => [newConv, ...prev]);
    }
    setSelectedConversation(newConv);
  }, [conversations]);

  // Sort conversations by last message time
  const sortedConversations = useCallback(() => {
    return [...filteredConversations()].sort(
      (a, b) => new Date(b.last_message_time) - new Date(a.last_message_time)
    );
  }, [filteredConversations]);

  return {
    // State
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    id_usuario,
    
    // Methods
    sendMessage,
    getOtherUserEmail,
    getOtherUserInfo,
    filteredConversations,
    sortedConversations,
    handleNewConversation
  };
};

export default useChat;