import React, { useState } from 'react';
import { useChat } from '@/hooks';
import ConversationList from '@/components/Chat/ConversationList';
import ChatWindow from '@/components/Chat/ChatWindow';
import MainLayout from '@/components/layouts/MainLayout';
import LoadingScreen from '@/components/LoadingScreen';

const ChatPage = () => {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    sendMessage,
    searchTerm,
    setSearchTerm,
    getOtherUserEmail,
    getOtherUserInfo,
    sortedConversations,
    handleNewConversation,
    id_usuario,
    loading
  } = useChat();

  // Estado para manejar vista móvil
  const [showChat, setShowChat] = useState(false);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setShowChat(true); // En móvil, mostrar el chat
  };

  const handleBackToList = () => {
    setShowChat(false);
  };
  
  if (loading) return <LoadingScreen />;

  return (
    <MainLayout fullHeight noPadding>
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="h-16 md:h-20 flex-shrink-0"></div>
        
        <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-white p-2 md:p-4 lg:p-6">
          <div className="flex w-full overflow-hidden rounded-xl md:rounded-2xl shadow-2xl border border-gray-200/50">
            {/* Lista de conversaciones - oculta en móvil cuando hay chat seleccionado */}
            <div className={`${showChat ? 'hidden' : 'flex'} md:flex w-full md:w-1/3 lg:w-1/4`}>
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                setSelectedConversation={handleSelectConversation}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortedConversations={sortedConversations}
                getOtherUserInfo={getOtherUserInfo}
                handleNewConversation={handleNewConversation}
                id_usuario={id_usuario}
              />
            </div>

            {/* Ventana de chat - oculta en móvil cuando no hay chat seleccionado */}
            <div className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1`}>
              <ChatWindow
                key={selectedConversation?.id_conversation}
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={sendMessage}
                otherUserEmail={getOtherUserEmail()}
                currentUserId={id_usuario}
                onBack={handleBackToList}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;