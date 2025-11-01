import apiClient from "./apiClient";

/**
 * Verifica si el perfil del usuario está completo
 * @param {number} id_usuario - ID del usuario
 * @param {string} userType - Tipo de usuario ('empresa' o 'freelancer')
 * @returns {boolean} - true si el perfil está incompleto, false si está completo
 */
export const verifyUserProfile = async (id_usuario, userType) => {
  let endpoint;
  
  // CAMBIO 1: Incluir los nuevos roles de empresa
  if (userType === 'empresa' || userType === 'empresa_juridico' || userType === 'empresa_natural') {
    // CAMBIO 2: Corregir el endpoint para que coincida con tu 'empresaRoutes.js'
    endpoint = `/empresa/get/${id_usuario}`;
  } else if (userType === 'freelancer') {
    endpoint = `/freelancer/get/${id_usuario}`;
  } else {
    throw new Error('Tipo de usuario no válido');
  }

  const response = await apiClient.get(endpoint);
  
  if (response.data && typeof response.data.isPerfilIncompleto === "boolean") {
    return response.data.isPerfilIncompleto;
  } else {
    throw new Error("Respuesta del servidor inesperada");
  }
};

/**
 * Crea una reseña para una empresa
 * @param {Object} reviewData - Datos de la reseña
 * @param {number} reviewData.id_usuario - ID del usuario que hace la reseña
 * @param {number} reviewData.calificacion - Calificación (1-5)
 * @param {string} reviewData.comentario - Comentario de la reseña
 * @param {number} reviewData.id_identificador - ID de la publicación/proyecto
 */
export const createReview = async (reviewData) => {
  const response = await apiClient.post('/empresa/reviews', reviewData);
  return response.data;
};