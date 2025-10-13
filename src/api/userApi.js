import apiClient from "./apiClient";

const BASE = "/users";

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
