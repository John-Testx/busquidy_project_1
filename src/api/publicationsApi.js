import apiClient from "./apiClient";

const BASE = "/projects";

/**
 * Obtiene todas las publicaciones activas
 */
export const getPublications = async () => {
  const response = await apiClient.get(`${BASE}/publicacion`);
  return response.data;
};

/**
 * Obtiene las postulaciones de un freelancer
 * @param {number} id_usuario - ID del freelancer
 */
export const getFreelancerApplications = async (id_usuario) => {
  const response = await apiClient.get(`/freelancer/postulaciones/${id_usuario}`);
  return response.data;
};

/**
 * Crea una postulación a una publicación
 * @param {number} id_publicacion - ID de la publicación
 * @returns {Promise} Respuesta de la API
 */
export const createApplication = async (id_publicacion) => {
  const response = await apiClient.post(`${BASE}/publicacion/${id_publicacion}/postular`);
  return response.data;
};

/**
 * Verifica si el usuario ya postuló a una publicación
 * @param {number} id_publicacion - ID de la publicación
 * @returns {Promise<{hasApplied: boolean}>}
 */
export const checkUserApplication = async (id_publicacion) => {
  const response = await apiClient.get(`${BASE}/publicacion/${id_publicacion}/check-application`);
  return response.data;
};

/**
 * Obtiene las postulaciones para un proyecto específico
 * @param {number} id_proyecto - ID del proyecto
 */
export const getPostulationsForProject = async (id_proyecto) => {
  const response = await apiClient.get(`${BASE}/${id_proyecto}/postulaciones`);
  return response.data;
};