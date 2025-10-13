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
 * @param {number} id_usuario - ID del usuario que postula
 */
export const createApplication = async (id_publicacion, id_usuario) => {
  const response = await apiClient.post(`/freelancer/postulacion/${id_publicacion}`, {
    id_usuario,
    id_publicacion
  });
  return response.data;
};