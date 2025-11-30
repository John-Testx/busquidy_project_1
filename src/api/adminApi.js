import apiClient from "./apiClient";

const BASE = "/admin/role";
const DISPUTE_BASE = "/admin/disputes";
const VERIFICATION_BASE = "/admin/verificacion"; // ✅ NUEVO

// ============= ROLES =============
export const getAllAdminRoles = () => apiClient.get(`${BASE}/get`);
export const createAdminRole = (role) => apiClient.post(`${BASE}/create`, role);
export const updateAdminRole = (id, role) => apiClient.put(`${BASE}/${id}`, role);
export const deleteAdminRole = (id) => apiClient.delete(`${BASE}/${id}`);

// ============= DISPUTAS Y REEMBOLSOS =============

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
 * Obtiene usuarios pendientes de verificación (estado 'en_revision')
 * @returns {Promise<Array>} Lista de usuarios en revisión
 */
export const getPendingVerifications = async () => {
  const response = await apiClient.get(`${VERIFICATION_BASE}/usuarios`);
  return response.data;
};

/**
 * Obtiene detalles de verificación de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Usuario y sus documentos
 */
export const getUserVerificationDetails = async (userId) => {
  const response = await apiClient.get(`${VERIFICATION_BASE}/documentos/${userId}`);
  return response.data;
};

/**
 * Aprueba la verificación de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Mensaje de confirmación
 */
export const approveUser = async (userId) => {
  const response = await apiClient.post(`${VERIFICATION_BASE}/approve/${userId}`);
  return response.data;
};

/**
 * Rechaza la verificación de un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} rejectData - { documentos: [{ id_documento, comentario }] }
 * @returns {Promise<Object>} Mensaje de confirmación
 */
export const rejectUser = async (userId, rejectData) => {
  const response = await apiClient.post(`${VERIFICATION_BASE}/reject/${userId}`, rejectData);
  return response.data;
};