import apiClient from './apiClient';

export const getProjectDeliverables = async (id_proyecto) => {
  const response = await apiClient.get(`/projects/${id_proyecto}/deliverables`);
  return response.data;
};

export const uploadDeliverable = async (id_proyecto, data) => {
  // data debe ser { descripcion, archivo_url, nombre_archivo }
  const response = await apiClient.post(`/projects/${id_proyecto}/deliverables`, data);
  return response.data;
};