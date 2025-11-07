import apiClient from "./apiClient";

const BASE = "/verification";

/**
 * Sube múltiples documentos de verificación
 * @param {FormData} formData - FormData con archivos y tipos
 * @returns {Promise<Object>}
 */
export const uploadVerificationDocs = async (formData) => {
  const response = await apiClient.post(`${BASE}/upload-docs`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Obtiene los documentos del usuario autenticado
 * @returns {Promise<Array>}
 */
export const getMyDocuments = async () => {
  const response = await apiClient.get(`${BASE}/my-documents`);
  return response.data.documentos;
};