import apiClient from "./apiClient";

const BASE = "/freelancer";
const EMPRESA_BASE = "/empresa";

// PERFIL
export const checkProfileExists = async (id_usuario) => {
  const response = await apiClient.get(`${BASE}/get/${id_usuario}`);
  return response.data;
};

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

// ===== VERIFICACIÓN DE PERFIL PARA PREMIUM =====

/**
 * Verifica si el perfil de la empresa está completo
 * @param {number} id_usuario - ID del usuario empresa
 * @returns {Promise<{isPerfilIncompleto: boolean}>}
 */
export const checkEmpresaProfileStatus = async (id_usuario) => {
  try {
    const response = await apiClient.get(`${EMPRESA_BASE}/get/${id_usuario}`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar el perfil de la empresa:", error);
    throw error;
  }
};

/**
 * Verifica el estado del perfil según el tipo de usuario para acceder a Premium
 * @param {string} tipo_usuario - Tipo de usuario (freelancer, empresa, administrador)
 * @param {number} id_usuario - ID del usuario
 * @returns {Promise<{isComplete: boolean, message?: string}>}
 */
export const verifyUserProfileForPremium = async (tipo_usuario, id_usuario) => {
  if (!tipo_usuario || !id_usuario) {
    return {
      isComplete: false,
      message: "Necesitas iniciar sesión para ser Busquidy +"
    };
  }

  try {
    if (tipo_usuario === "freelancer") {
      const data = await checkProfileExists(id_usuario); // ✅ Directamente los datos
      if (data.isPerfilIncompleto) {
        return {
          isComplete: false,
          message: "Completa tu perfil para ser Busquidy +."
        };
      }
      return { isComplete: true };
    } 
    
    if (tipo_usuario === "empresa") {
      const response = await checkEmpresaProfileStatus(id_usuario);
      if (response.isPerfilIncompleto) {
        return {
          isComplete: false,
          message: "Completa tu perfil para ser Busquidy +"
        };
      }
      return { isComplete: true };
    }
    
    if (tipo_usuario === "administrador") {
      return {
        isComplete: false,
        message: "Los administradores no pueden acceder a Busquidy +"
      };
    }

    return {
      isComplete: false,
      message: "Tipo de usuario no válido"
    };
  } catch (error) {
    console.error("Error al verificar el perfil:", error);
    throw error;
  }
};