import apiClient from "./apiClient";

const BASE_URL = "/chat";

export const getConversations = () => {
  return apiClient.get(`${BASE_URL}/conversations`);
};

export const getMessages = (conversationId) => {
  return apiClient.get(`${BASE_URL}/messages/${conversationId}`);
};

export const createConversation = (otherUserId) => {
  return apiClient.post(`${BASE_URL}/conversations`, { otherUserId });
};

export const getUsersForChat = () => {
  return apiClient.get(`${BASE_URL}/users`);
};

export const getConversationById = (conversationId) => {
  return apiClient.get(`${BASE_URL}/conversation/${conversationId}`);
};