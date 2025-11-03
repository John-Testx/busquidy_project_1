import apiClient from "./apiClient";
const BASE = "/users";

// =============================================
// GESTIÓN DE USUARIOS (Admin)
// =============================================
export const getUsuarios = async () => {
  const response = await apiClient.get(`${BASE}/get/usuarios`);
  return response.data;
};

export const deleteUsuario = async (id_usuario) => {
  const response = await apiClient.delete(`${BASE}/delete/${id_usuario}`);
  return response.data;
};

export const updateUserStatus = (id, isActive) =>
  apiClient.patch(`${BASE}/${id}/status`, { is_active: isActive });

export const getUserDetails = async (id) => {
  const response = await apiClient.get(`${BASE}/${id}`);
  return response.data;
};

export const updateUserDetails = (id, data) =>
  apiClient.patch(`${BASE}/${id}`, data);

export const getAdminRoles = async (adminId) => {
  const response = await apiClient.get(`/admin/roles/${adminId}`);
  return response.data;
};

export const updateAdminRoles = (adminId, roles) =>
  apiClient.patch(`/admins/${adminId}/roles`, { roles });

export const createFreelancerProfile = async (freelancerData, id_usuario) => {
  const response = await apiClient.post(
    `/freelancer/create-perfil-freelancer`,
    { ...freelancerData, id_usuario }
  );
  return response.data;
};

// =============================================
// AUTENTICACIÓN
// =============================================

/**
 * Inicia sesión de un usuario
 * @param {string} correo - Correo del usuario
 * @param {string} contraseña - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario y token
 */
export const loginUser = async (correo, contraseña) => {
  const response = await apiClient.post(`${BASE}/login`, {
    correo,
    contraseña,
  });
  return response.data;
};

/**
 * Registra un nuevo usuario
 * @param {string} correo - Correo del usuario
 * @param {string} contraseña - Contraseña del usuario
 * @param {string} tipo_usuario - Tipo de usuario: 'freelancer', 'empresa_juridico', 'empresa_natural'
 * @returns {Promise<Object>} Datos del usuario registrado
 */
export const registerUser = async (correo, contraseña, tipo_usuario) => {
  const response = await apiClient.post(`${BASE}/register`, {
    correo,
    contraseña,
    tipo_usuario,
  });
  return response.data;
};

// =============================================
// USO DEL PLAN
// =============================================

/**
 * Obtiene el uso del plan del usuario logueado
 * @returns {Promise<Object>} Información del plan y uso de créditos
 */
export const getMyUsage = async () => {
  const response = await apiClient.get('/me/usage');
  return response.data;
};

// =============================================
// RECUPERACIÓN DE CONTRASEÑA
// =============================================

/**
 * Solicita un enlace de recuperación de contraseña
 * @param {string} correo - Correo del usuario
 * @returns {Promise<Object>} Mensaje de confirmación
 */
export const requestPasswordReset = async (correo) => {
  const response = await apiClient.post(`${BASE}/forgot-password`, { correo });
  return response.data;
};

/**
 * Resetea la contraseña usando el token
 * @param {string} token - Token de reseteo
 * @param {string} nuevaContraseña - Nueva contraseña
 * @returns {Promise<Object>} Mensaje de confirmación
 */
export const resetPassword = async (token, nuevaContraseña) => {
  const response = await apiClient.post(`${BASE}/reset-password`, {
    token,
    nuevaContraseña,
  });
  return response.data;
};

/**
 * Actualizar credenciales del usuario (email y/o contraseña)
 * @param {Object} data - { currentPassword, newEmail?, newPassword? }
 * @returns {Promise} Respuesta de la API
 */
export const updateCredentials = (data) => {
  return apiClient.put(`${BASE}/update-credentials`, data);
};