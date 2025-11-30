import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '@/hooks';
import ConversationList from '@/components/Chat/ConversationList';
import ChatWindow from '@/components/Chat/ChatWindow';
import MainLayout from '@/components/Layouts/MainLayout';
import LoadingScreen from '@/components/LoadingScreen';

const ChatPage = () => {
  const { conversationId } = useParams();
  
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
    loading,
    solicitudData
  } = useChat();

  const [showChat, setShowChat] = useState(false);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
  };
  
  if (loading) return <LoadingScreen />;

  return (
    <MainLayout fullHeight noPadding>
      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Espaciador para el navbar */}
        <div className="h-16 md:h-20 flex-shrink-0"></div>
        
        {/* Contenedor principal con margen superior y lateral */}
        <div className="flex-1 flex overflow-hidden mx-4 md:mx-6 lg:mx-8 mt-4 md:mt-6 mb-4 md:mb-6 rounded-2xl shadow-2xl border border-gray-200/50">
          {/* Sidebar de conversaciones */}
          <div className={`${showChat ? 'hidden' : 'flex'} md:flex w-full md:w-96 lg:w-[400px] flex-shrink-0`}>
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

          {/* Ventana de chat */}
          <div className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1`}>
            {conversationId ? (
              <ChatWindow
                key={selectedConversation?.id_conversation}
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={sendMessage}
                otherUserEmail={getOtherUserEmail()}
                currentUserId={id_usuario}
                solicitudData={solicitudData}
                onBack={handleBackToList}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg 
                      className="w-12 h-12 text-gray-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Selecciona una conversación</h3>
                  <p className="text-gray-500">Elige un chat de la lista para comenzar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;