import apiClient from "./apiClient";

/**
 * Confirma una transacción de pago
 * @param {string} token_ws - Token de Webpay
 * @returns {Promise<Object>} Datos de la transacción confirmada
 */
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

/**
 * Obtiene los planes de suscripción según el tipo de usuario
 * @param {string} tipo_usuario - Tipo de usuario (ej: 'emprendedor', 'inversionista')
 * @returns {Promise} - Lista de planes de suscripción
 */
export const getSubscriptionPlans = async (tipo_usuario) => {
  const response = await apiClient.get("/payments/plan", {
    params: { tipo_usuario }
  });
  return response.data;
};

/**
 * Crea una transacción de suscripción
 * @param {Object} paymentData - Datos del pago
 * @param {number} paymentData.amount - Monto del pago
 * @param {string} paymentData.buyOrder - Orden de compra
 * @param {string} paymentData.sessionId - ID de sesión
 * @param {number} paymentData.plan - ID del plan seleccionado
 * @param {string} paymentData.tipoUsuario - Tipo de usuario
 * @param {string} paymentData.metodoPago - Método de pago seleccionado
 * @param {string} paymentData.returnUrl - URL de retorno
 * @returns {Promise} - Datos de la transacción (url y token)
 */
export const createSubscriptionTransaction = async (paymentData) => {
  const response = await apiClient.post(
    "/payments/create_transaction_suscription",
    paymentData,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};