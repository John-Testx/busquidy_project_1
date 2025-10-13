import apiClient from "./apiClient";

export const commitTransaction = async (token_ws) => {
  const response = await apiClient.post("/payments/commit_transaction", {
    token: token_ws,
  });
  return response.data;
};
