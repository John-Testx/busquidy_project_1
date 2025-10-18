import apiClient from "./apiClient";

const BASE_URL = "/empresa";

/**
 * Obtiene el perfil completo de la empresa.
 * @param {number} id_usuario - El ID del usuario de la empresa.
 * @returns {Promise<object>} Los datos del perfil de la empresa.
 */
export const getEmpresaProfile = async (id_usuario) => {
  const response = await apiClient.get(`${BASE_URL}/get/perfil-empresa/${id_usuario}`);
  return response.data;
};

/**
 * Actualiza el perfil completo de la empresa.
 * @param {number} id_usuario - El ID del usuario de la empresa.
 * @param {object} profileData - El objeto completo con los datos del perfil a actualizar.
 * @returns {Promise<object>} La respuesta del servidor.
 */
export const updateEmpresaProfile = async (id_usuario, profileData) => {
  const response = await apiClient.put(`${BASE_URL}/update/${id_usuario}`, profileData);
  return response.data;
};

// You can add other empresa-related API functions here in the future