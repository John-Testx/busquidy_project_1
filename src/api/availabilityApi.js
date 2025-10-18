import apiClient from './apiClient';

const BASE_URL = '/freelancer/availability';

/**
 * Obtiene todos los bloques de disponibilidad del freelancer autenticado (vía token).
 */
export const getAvailability = () => {
  return apiClient.get(BASE_URL);
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