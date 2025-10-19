import apiClient from "./apiClient";

const BASE = "/projects";
const EMPRESA_BASE = "/empresa";
const PAYMENTS_BASE = "/payments";

// =============================================
// GESTIÓN DE PROYECTOS
// =============================================

/**
 * Obtiene todos los proyectos de una empresa
 * @param {number} userId - ID del usuario empresa
 * @returns {Promise<Array>} Lista de proyectos
 */
export const getProjects = async (userId) => {
  const response = await apiClient.get(`${BASE}/get/${userId}`);
  return response.data;
};

/**
 * Obtiene un proyecto específico por ID
 * @param {number} id_proyecto - ID del proyecto
 * @returns {Promise<Object>} Datos del proyecto
 */
export const getProjectById = async (id_proyecto) => {
  const response = await apiClient.get(`${BASE}/getProject/${id_proyecto}`);
  return response.data;
};

/**
 * Crea un nuevo proyecto
 * @param {Object} projectData - Datos del proyecto
 * @param {number} id_usuario - ID del usuario empresa
 * @returns {Promise<Object>} Proyecto creado
 */
export const createProject = async (projectData, id_usuario) => {
  const response = await apiClient.post(`${BASE}/create-project`, {
    projectData,
    id_usuario,
  });
  return response.data;
};

/**
 * Actualiza un proyecto existente
 * @param {number} id_proyecto - ID del proyecto
 * @param {Object} projectData - Datos actualizados del proyecto
 * @returns {Promise<Object>} Proyecto actualizado
 */
export const updateProject = async (id_proyecto, projectData) => {
  const response = await apiClient.put(`${BASE}/updateProject/${id_proyecto}`, projectData);
  return response.data;
};

/**
 * Elimina un proyecto
 * @param {number} projectId - ID del proyecto a eliminar
 * @returns {Promise<Object>} Respuesta de la eliminación
 */
export const deleteProject = async (projectId) => {
  const response = await apiClient.delete(`${BASE}/delete/${projectId}`);
  return response.data;
};

// =============================================
// VERIFICACIÓN DE PERFIL
// =============================================

/**
 * Verifica si el perfil de la empresa está completo
 * @param {number} userId - ID del usuario empresa
 * @returns {Promise<boolean>} true si el perfil está incompleto
 */
export const checkCompanyProfile = async (userId) => {
  const response = await apiClient.get(`${EMPRESA_BASE}/get/${userId}`);
  return response.data.isPerfilIncompleto;
};

// =============================================
// PUBLICACIÓN DE PROYECTOS (PAGOS)
// =============================================

/**
 * Crea una transacción de pago para publicar un proyecto
 * @param {Object} paymentData - Datos del pago
 * @returns {Promise<{url: string, token: string}>} URL y token de Webpay
 */
export const createProjectPayment = async (paymentData) => {
  const response = await apiClient.post(
    `${PAYMENTS_BASE}/create_transaction_project`,
    paymentData
  );
  return response.data;
};

/**
 * Confirma una transacción de pago
 * @param {string} token - Token de la transacción
 * @returns {Promise<Object>} Resultado de la transacción
 */
export const commitPaymentTransaction = async (token) => {
  const response = await apiClient.post(
    `${PAYMENTS_BASE}/commit_transaction`,
    { token }
  );
  return response.data;
};

// =============================================
// ADMINISTRACIÓN (para usuarios admin)
// =============================================

/**
 * Obtiene todos los proyectos (solo admin)
 * @returns {Promise<Array>} Lista de todos los proyectos
 */
export const getAllProjects = () => apiClient.get(`${BASE}/getProjects`);

/**
 * Actualiza el estado de publicación de un proyecto (solo admin)
 * @param {number} id_proyecto - ID del proyecto
 * @param {string} estado_publicacion - Nuevo estado
 * @returns {Promise<Object>} Proyecto actualizado
 */
export const updateProjectState = (id_proyecto, estado_publicacion) =>
  apiClient.put(`${BASE}/update-proyecto-state/${id_proyecto}`, { estado_publicacion });