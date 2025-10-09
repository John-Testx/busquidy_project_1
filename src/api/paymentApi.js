const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const commitTransaction = async (token_ws) => {
  const response = await axios.post(`${API_URL}/payments/commit_transaction`, {
    token: token_ws,
  });
  return response.data;
};