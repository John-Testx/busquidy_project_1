import apiClient from './apiClient';

const BASE_URL = '/freelancer/availability';

/**
 * Obtiene todos los bloques de disponibilidad del freelancer autenticado (vía token).
 */
export const getAvailability =  async () => {
  const response = await apiClient.get(BASE_URL);
  return response;
};

/**
 * Añade un nuevo bloque de disponibilidad para el freelancer autenticado.
 * @param {object} availabilityData - { dia_semana, hora_inicio, hora_fin }
 */
export const addAvailability = (availabilityData) => {
  return apiClient.post(BASE_URL, availabilityData);
};

/**
 * Elimina un bloque de disponibilidad por su ID para el freelancer autenticado.
 * @param {number} availabilityId - El ID del bloque de horario a eliminar.
 */
export const deleteAvailability = (availabilityId) => {
  // The backend route is DELETE /:id_disponibilidad
  return apiClient.delete(`${BASE_URL}/${availabilityId}`);
};

// ✅ NUEVA FUNCIÓN: Obtener disponibilidad de un freelancer específico
export const getFreelancerAvailability = (id_freelancer) => {
  return apiClient.get(`${BASE_URL}/freelancer/${id_freelancer}`);
};