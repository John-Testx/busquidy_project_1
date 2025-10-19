import React from 'react';
import {useChat} from '@/hooks';
import ConversationList from '@/components/Chat/ConversationList';
import ChatWindow from '@/components/Chat/ChatWindow';
import Navbar from '@/components/Home/Navbar';

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
    id_usuario
  } = useChat();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
      <Navbar />
      
      <main className="flex flex-1 overflow-hidden pt-navbar">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortedConversations={sortedConversations}
          getOtherUserInfo={getOtherUserInfo}
          handleNewConversation={handleNewConversation}
          id_usuario={id_usuario}
        />
        <ChatWindow
          key={selectedConversation?.id_conversation}
          conversation={selectedConversation}
          messages={messages}
          onSendMessage={sendMessage}
          otherUserEmail={getOtherUserEmail()}
          currentUserId={id_usuario}
        />
      </main>
    </div>
  );
};

export default ChatPage;