import apiClient from "./apiClient";

const BASE = "/freelancer";

// PERFIL
export const checkProfileExists = (id_usuario) =>
  apiClient.get(`${BASE}/get/${id_usuario}`);

export const getFreelancerProfile = (id_usuario) =>
  apiClient.get(`${BASE}/perfil-freelancer/${id_usuario}`);

export const createFreelancerProfile = (freelancerData, id_usuario) =>
  apiClient.post(`${BASE}/create-perfil-freelancer`, {
    ...freelancerData,
    id_usuario,
  });

export const updateProfileSection = (id_usuario, section, data) =>
  apiClient.put(`${BASE}/update-freelancer/${id_usuario}/${section}`, data);

// SECCIONES
export const addItemToSection = (id_usuario, itemType, data) =>
  apiClient.post(`${BASE}/add-freelancer/${id_usuario}/${itemType}`, data);

export const deleteItem = (id_usuario, seccion, id) =>
  apiClient.delete(`${BASE}/delete-idioma-habilidad/${id_usuario}/${seccion}/${id}`);

// CV
export const uploadCV = (cvFile, id_usuario) => {
  const formData = new FormData();
  formData.append("cv", cvFile);
  formData.append("id_usuario", id_usuario);
  return apiClient.post(`${BASE}/upload-cv`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getCVUrl = (id_freelancer) =>
  apiClient.get(`${BASE}/freelancer/${id_freelancer}/cv`);

// POSTULACIONES
export const createApplication = (id_publicacion, id_usuario) =>
  apiClient.post(`${BASE}/postulacion/${id_publicacion}`, { id_usuario });

export const getApplications = (id_usuario) =>
  apiClient.get(`${BASE}/postulaciones/${id_usuario}`);

export const deleteApplication = (id_postulacion) =>
  apiClient.delete(`${BASE}/delete-postulacion/${id_postulacion}`);

// BÚSQUEDA Y LISTADO
export const listFreelancers = () => apiClient.get(`${BASE}/list`);

export const getFreelancerPublicProfile = (id_freelancer) =>
  apiClient.get(`${BASE}/freelancer-perfil/${id_freelancer}`);
