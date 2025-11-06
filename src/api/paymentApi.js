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

/**
 * [ADMIN] Obtiene todos los pagos de proyectos.
 */
export const getProjectPayments = () => apiClient.get("/payments/pagos-proyectos");

/**
 * [ADMIN] Obtiene todos los pagos de suscripciones.
 */
export const getSubscriptionPayments = () => apiClient.get("/payments/pagos-suscripciones");

// Mantenemos esta función por si la usas en otro lado, pero para el dashboard usaremos las nuevas.
// Si no la usas en otro lado, puedes eliminarla.
export const getAllPayments = () => apiClient.get("/admin/payments"); // O la ruta que sea para otros casos

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

/**
 * Obtiene TODOS los planes de suscripción sin filtro
 * @returns {Promise} - Lista completa de planes
 */
export const getAllSubscriptionPlans = async () => {
  const response = await apiClient.get("/payments/plan");
  return response.data;
};

/**
 * Obtiene la suscripción activa del usuario
 * @returns {Promise} - Suscripción activa
 */
export const getActiveSubscription = async () => {
  const response = await apiClient.get("/subscriptions/active");
  return response.data;
};

/**
 * Cancela la suscripción activa
 * @returns {Promise} - Confirmación de cancelación
 */
export const cancelSubscription = async () => {
  const response = await apiClient.post("/subscriptions/cancel");
  return response.data;
};

/**
 * Cambia el plan de suscripción
 * @param {number} planId - ID del nuevo plan
 * @returns {Promise} - URL de checkout o confirmación
 */
export const changeSubscriptionPlan = async (planId) => {
  const response = await apiClient.post("/subscriptions/change-plan", { planId });
  return response.data;
};

/**
 * Obtiene las transacciones del usuario logueado
 * @returns {Promise} - Lista de transacciones
 */
export const getMyTransactions = async () => {
  const response = await apiClient.get("/payments/my-transactions");
  return response.data;
};