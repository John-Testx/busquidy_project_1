import apiClient from "./apiClient";

const BASE = "/projects";

export const getProjects = async (userId) => {
  const response = await apiClient.get(`${BASE}/get/${userId}`);
  return response.data;
};

export const getProjectById = async (id_proyecto) => {
  const response = await apiClient.get(`${BASE}/getProject/${id_proyecto}`);
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

export const checkCompanyProfile = async (userId) => {
  const response = await apiClient.get(`/empresa/get/${userId}`);
  return response.data.isPerfilIncompleto;
};
