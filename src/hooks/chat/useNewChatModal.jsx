import { useState, useEffect, useCallback } from 'react';
import { getUsersForChat, createConversation } from '@/api/chatApi';

const useNewChatModal = (isOpen) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getUsersForChat();
          setUsers(response.data);
        } catch (err) {
          setError("Error al cargar los usuarios. Intenta de nuevo.");
          console.error("Error fetching users for chat:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUsers();
    } else {
      // Reset state when modal closes
      setUsers([]);
      setSearchTerm('');
      setError(null);
    }
  }, [isOpen]);

  // Filter users by search term
  const filteredUsers = useCallback(() => {
    return users.filter(user =>
      user.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Start a new conversation
  const startConversation = async (otherUserId) => {
    try {
      const response = await createConversation(otherUserId);
      return { success: true, data: response.data };
    } catch (err) {
      setError("Error al iniciar la conversación.");
      console.error("Error creating conversation:", err);
      return { success: false, error: err };
    }
  };

  return {
    users,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    setError,
    filteredUsers,
    startConversation
  };
};

export default useNewChatModal;