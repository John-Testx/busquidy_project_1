import apiClient from "./apiClient";

const BASE_URL = "/contact-requests";

/**
 * Crear una solicitud de contacto (chat o entrevista)
 * @param {Object} data - Datos de la solicitud
 * @param {number} data.id_postulacion - ID de la postulación
 * @param {string} data.tipo_solicitud - 'chat' o 'entrevista'
 * @param {string} data.fecha_entrevista_sugerida - Fecha para entrevista (opcional)
 * @param {string} data.mensaje_solicitud - Mensaje personalizado (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const createContactRequest = async (data) => {
  const response = await apiClient.post(BASE_URL, data);
  return response.data;
};

/**
 * Responder a una solicitud de contacto
 * @param {number} id_solicitud - ID de la solicitud
 * @param {Object} data - Datos de la respuesta
 * @param {string} data.respuesta - 'aceptada', 'rechazada', 'reprogramar'
 * @param {string} data.nueva_fecha - Nueva fecha si se reprograma (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const respondContactRequest = async (id_solicitud, estado) => {
    // Asegúrate de enviar { estado } como objeto
    const response = await apiClient.patch(`${BASE_URL}/${id_solicitud}/respond`, { estado });
    return response.data;
};

/**
 * Obtener solicitudes del usuario
 * @returns {Promise<Array>} Lista de solicitudes
 */
export const getContactRequests = async () => {
  const response = await apiClient.get(BASE_URL);
  return response.data;
};

/**
 * ✅ NUEVA: Obtener detalles de una solicitud específica
 */
export const getContactRequestById = async (id_solicitud) => {
  const response = await apiClient.get(`${BASE_URL}/${id_solicitud}`);
  return response.data;
};