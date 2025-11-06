import apiClient from "./apiClient";

const BASE = "/admin/role";
const DISPUTE_BASE = "/admin/disputes"; // <- NUEVO

// ============= ROLES =============
export const getAllAdminRoles = () => apiClient.get(`${BASE}/get`);
export const createAdminRole = (role) => apiClient.post(`${BASE}/create`, role);
export const updateAdminRole = (id, role) => apiClient.put(`${BASE}/${id}`, role);
export const deleteAdminRole = (id) => apiClient.delete(`${BASE}/${id}`);

// ============= DISPUTAS Y REEMBOLSOS (NUEVO) =============

/**
 * Obtiene todos los proyectos con pagos en garantía
 * @returns {Promise<Array>} Lista de proyectos con disputas
 */
export const getDisputedProjects = async () => {
  const response = await apiClient.get(`${DISPUTE_BASE}/projects`);
  return response.data;
};

/**
 * Reembolsa el pago en garantía a la empresa
 * @param {number} id_proyecto - ID del proyecto
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const refundProjectPayment = async (id_proyecto) => {
  const response = await apiClient.post(`${DISPUTE_BASE}/refund/${id_proyecto}`);
  return response.data;
};

// ============= VERIFICACIÓN DE DOCUMENTOS (NUEVO) =============

/**
 * Obtiene usuarios pendientes de verificación
 * @returns {Promise<Array>} Lista de usuarios en revisión
 */
export const getPendingVerifications = async () => {
  const response = await apiClient.get('/admin/verificaciones/pendientes');
  return response.data;
};

/**
 * Obtiene detalles de verificación de un usuario
 * @param {number} id_usuario - ID del usuario
 * @returns {Promise<Object>} Usuario y sus documentos
 */
export const getUserVerificationDetails = async (id_usuario) => {
  const response = await apiClient.get(`/admin/verificaciones/usuario/${id_usuario}`);
  return response.data;
};

/**
 * Aprueba la verificación de un usuario
 * @param {number} id_usuario - ID del usuario
 * @returns {Promise<Object>} Mensaje de confirmación
 */
export const approveUserVerification = async (id_usuario) => {
  const response = await apiClient.post('/admin/verificaciones/aprobar', { id_usuario });
  return response.data;
};

/**
 * Rechaza la verificación de un usuario
 * @param {number} id_usuario - ID del usuario
 * @param {string} motivo - Motivo del rechazo
 * @returns {Promise<Object>} Mensaje de confirmación
 */
export const rejectUserVerification = async (id_usuario, motivo) => {
  const response = await apiClient.post('/admin/verificaciones/rechazar', { id_usuario, motivo });
  return response.data;
};