import apiClient from "./apiClient";

const BASE = "/admin/role";

export const getAllAdminRoles = () => apiClient.get(`${BASE}/get`);

export const createAdminRole = (role) => apiClient.post(`${BASE}/create`, role);

export const updateAdminRole = (id, role) =>
  apiClient.put(`${BASE}/${id}`, role);

export const deleteAdminRole = (id) => apiClient.delete(`${BASE}/${id}`);
