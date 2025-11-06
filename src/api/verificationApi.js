import apiClient from "./apiClient";

const BASE = "/verification";

/**
 * Valida el token de verificación del email
 * @param {string} token - Token de verificación
 * @returns {Promise<Object>} JWT y datos del usuario
 */
export const validateVerificationToken = async (token) => {
  const response = await apiClient.get(`${BASE}/verify-token/${token}`);
  return response.data;
};

/**
 * Sube un documento de verificación
 * @param {File} file - Archivo a subir
 * @param {string} tipoDocumento - Tipo de documento
 * @returns {Promise<Object>} URL del documento subido
 */
export const uploadDocument = async (file, tipoDocumento) => {
  const formData = new FormData();
  formData.append('documento', file);
  formData.append('tipo_documento', tipoDocumento);

  const response = await apiClient.post(`${BASE}/upload-document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Obtiene los documentos del usuario
 * @returns {Promise<Array>} Lista de documentos
 */
export const getUserDocuments = async () => {
  const response = await apiClient.get(`${BASE}/documents`);
  return response.data.documentos;
};

/**
 * Envía los documentos a revisión
 * @returns {Promise<Object>} Mensaje de confirmación
 */
export const submitForReview = async () => {
  const response = await apiClient.post(`${BASE}/submit-for-review`);
  return response.data;
};