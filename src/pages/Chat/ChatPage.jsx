import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '@/hooks';
import ConversationList from '@/components/Chat/ConversationList';
import ChatWindow from '@/components/Chat/ChatWindow';
import MainLayout from '@/components/layouts/MainLayout';
import LoadingScreen from '@/components/LoadingScreen';

const ChatPage = () => {
  const { conversationId } = useParams(); // ✅ Obtener conversationId de la URL
  
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
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="h-16 md:h-20 flex-shrink-0"></div>
        
        <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-white p-2 md:p-4 lg:p-6">
          <div className="flex w-full overflow-hidden rounded-xl md:rounded-2xl shadow-2xl border border-gray-200/50">
            {/* ✅ Sidebar: Siempre visible en desktop */}
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

            {/* ✅ ChatWindow: Solo se muestra si hay conversationId */}
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
                // ✅ Mensaje cuando no hay conversación seleccionada
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <svg 
                      className="mx-auto mb-4 w-16 h-16 text-gray-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                      />
                    </svg>
                    <p className="text-lg font-medium">Selecciona una conversación</p>
                    <p className="text-sm mt-2">Elige un chat de la lista para comenzar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;