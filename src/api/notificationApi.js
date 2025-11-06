import apiClient from "./apiClient";

const BASE_URL = "/notifications";

/**
 * Obtiene todas las notificaciones del usuario autenticado
 * @param {boolean} solo_no_leidas - Si true, solo devuelve no leídas
 * @returns {Promise<Array>} Lista de notificaciones
 */
export const getNotifications = async (solo_no_leidas = false) => {
  const response = await apiClient.get(BASE_URL, {
    params: { solo_no_leidas }
  });
  return response.data;
};

/**
 * Obtiene el contador de notificaciones no leídas
 * @returns {Promise<{count: number}>} Contador de notificaciones
 */
export const getUnreadCount = async () => {
  const response = await apiClient.get(`${BASE_URL}/unread/count`);
  return response.data;
};

/**
 * Marca una notificación específica como leída
 * @param {number} id_notificacion - ID de la notificación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const markAsRead = async (id_notificacion) => {
  const response = await apiClient.patch(`${BASE_URL}/${id_notificacion}/read`);
  return response.data;
};

/**
 * Marca todas las notificaciones como leídas
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const markAllAsRead = async () => {
  const response = await apiClient.patch(`${BASE_URL}/read-all`);
  return response.data;
};

/**
 * Elimina una notificación
 * @param {number} id_notificacion - ID de la notificación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const deleteNotification = async (id_notificacion) => {
  const response = await apiClient.delete(`${BASE_URL}/${id_notificacion}`);
  return response.data;
};