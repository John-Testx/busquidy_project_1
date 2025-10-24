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