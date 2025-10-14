import apiClient from "./apiClient";

export const commitTransaction = async (token_ws) => {
  const response = await apiClient.post("/payments/commit_transaction", {
    token: token_ws,
  });
  return response.data;
};

export const getPagosProyectos = () =>
  apiClient.get("/payments/pagos-proyectos");

export const getPagosSuscripciones = () =>
  apiClient.get("/payments/pagos-suscripciones");

export const getAllPayments = () =>
  apiClient.get("/payments/getAll");