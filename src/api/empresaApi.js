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
 * Verifica el estado del perfil de la empresa (si está completo o no).
 * @param {number} id_usuario - El ID del usuario de la empresa.
 * @returns {Promise<object>} Un objeto que contiene el estado del perfil, ej: { isPerfilIncompleto: true }.
 */
export const checkEmpresaProfileStatus = async (id_usuario) => {
  const response = await apiClient.get(`${BASE_URL}/get/${id_usuario}`);
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

/**
 * Crea el perfil de una empresa
 * @param {Object} empresaData - Datos de la empresa
 * @param {Object} representanteData - Datos del representante legal
 * @param {number} id_usuario - ID del usuario
 * @returns {Promise<Object>} Respuesta de la creación del perfil
 */
export const createEmpresaProfile = async (empresaData, representanteData, id_usuario) => {
  const response = await apiClient.post(`${BASE_URL}/create-perfil-empresa`, {
    empresaData,
    representanteData,
    id_usuario
  });
  return response.data;
};