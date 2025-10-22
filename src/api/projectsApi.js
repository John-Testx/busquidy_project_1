import apiClient from "./apiClient";

const BASE = "/projects";
const EMPRESA_BASE = "/empresa";
const PAYMENTS_BASE = "/payments";

// =============================================
// GESTIÓN DE PROYECTOS
// =============================================

export const getProjects = async (userId) => {
  const response = await apiClient.get(`${BASE}/get/${userId}`);
  return response.data;
};

export const getProjectById = async (id_proyecto) => {
  const response = await apiClient.get(`${BASE}/getProject/${id_proyecto}`);
  return response.data;
};

export const createProject = async (projectData, id_usuario) => {
  const response = await apiClient.post(`${BASE}/create-project`, {
    projectData,
    id_usuario,
  });
  return response.data;
};

export const updateProject = async (id_proyecto, projectData) => {
  const response = await apiClient.put(`${BASE}/updateProject/${id_proyecto}`, projectData);
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await apiClient.delete(`${BASE}/delete/${projectId}`);
  return response.data;
};

// =============================================
// VERIFICACIÓN DE PERFIL
// =============================================

export const checkCompanyProfile = async (userId) => {
  const response = await apiClient.get(`${EMPRESA_BASE}/get/${userId}`);
  return response.data.isPerfilIncompleto;
};

// =============================================
// PUBLICACIÓN DE PROYECTOS (PAGOS)
// =============================================

export const createProjectPayment = async (paymentData) => {
  const response = await apiClient.post(
    `${PAYMENTS_BASE}/create_transaction_project`,
    paymentData
  );
  return response.data;
};

export const commitPaymentTransaction = async (token) => {
  const response = await apiClient.post(
    `${PAYMENTS_BASE}/commit_transaction`,
    { token }
  );
  return response.data;
};

// =============================================
// LIBERACIÓN DE PAGO (NUEVO)
// =============================================

/**
 * Libera el pago en garantía al freelancer
 * @param {number} id_proyecto - ID del proyecto
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const releaseProjectPayment = async (id_proyecto) => {
  const response = await apiClient.post(`${BASE}/release-payment/${id_proyecto}`);
  return response.data;
};

// =============================================
// ADMINISTRACIÓN (para usuarios admin)
// =============================================

export const getAllProjects = () => apiClient.get(`${BASE}/getProjects`);

export const updateProjectState = (id_proyecto, estado_publicacion) =>
  apiClient.put(`${BASE}/update-proyecto-state/${id_proyecto}`, { estado_publicacion });