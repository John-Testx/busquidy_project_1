import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/freelancer";

// Helper para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ============================================
// PERFIL
// ============================================

/**
 * Verifica si el perfil del freelancer existe y está completo
 */
export const checkProfileExists = async (id_usuario) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get/${id_usuario}`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar el perfil:", error);
    throw error;
  }
};

/**
 * Obtiene el perfil completo del freelancer
 */
export const getFreelancerProfile = async (id_usuario) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/perfil-freelancer/${id_usuario}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    throw error;
  }
};

/**
 * Crea un nuevo perfil de freelancer
 */
export const createFreelancerProfile = async (freelancerData, id_usuario) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create-perfil-freelancer`,
      { ...freelancerData, id_usuario },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear el perfil:", error);
    throw error.response?.data || error;
  }
};

/**
 * Actualiza una sección específica del perfil
 */
export const updateProfileSection = async (id_usuario, section, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update-freelancer/${id_usuario}/${section}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar ${section}:`, error);
    throw error;
  }
};

// ============================================
// SECCIONES (Idiomas, Habilidades, etc.)
// ============================================

/**
 * Agrega un nuevo elemento a una sección (idioma, habilidad, experiencia, etc.)
 */
export const addItemToSection = async (id_usuario, itemType, data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/add-freelancer/${id_usuario}/${itemType}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error al agregar ${itemType}:`, error);
    throw error;
  }
};

/**
 * Elimina un idioma o habilidad
 */
export const deleteItem = async (id_usuario, seccion, id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/delete-idioma-habilidad/${id_usuario}/${seccion}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar ${seccion}:`, error);
    throw error;
  }
};

// ============================================
// CV
// ============================================

/**
 * Sube y procesa un CV
 */
export const uploadCV = async (cvFile, id_usuario) => {
  try {
    const formData = new FormData();
    formData.append("cv", cvFile);
    formData.append("id_usuario", id_usuario);

    const response = await axios.post(`${API_BASE_URL}/upload-cv`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir el CV:", error);
    throw error;
  }
};

/**
 * Obtiene la URL del CV del freelancer
 */
export const getCVUrl = async (id_freelancer) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/freelancer/${id_freelancer}/cv`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la URL del CV:", error);
    throw error;
  }
};

// ============================================
// POSTULACIONES
// ============================================

/**
 * Crea una postulación a un proyecto
 */
export const createApplication = async (id_publicacion, id_usuario) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/postulacion/${id_publicacion}`,
      { id_usuario }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear postulación:", error);
    throw error;
  }
};

/**
 * Obtiene todas las postulaciones del freelancer
 */
export const getApplications = async (id_usuario) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/postulaciones/${id_usuario}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener postulaciones:", error);
    throw error;
  }
};

/**
 * Elimina una postulación
 */
export const deleteApplication = async (id_postulacion) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-postulacion/${id_postulacion}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar postulación:", error);
    throw error;
  }
};

// ============================================
// BÚSQUEDA Y LISTADO
// ============================================

/**
 * Lista todos los freelancers
 */
export const listFreelancers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list`);
    return response.data;
  } catch (error) {
    console.error("Error al listar freelancers:", error);
    throw error;
  }
};

/**
 * Obtiene el perfil público de un freelancer
 */
export const getFreelancerPublicProfile = async (id_freelancer) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/freelancer-perfil/${id_freelancer}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener perfil público:", error);
    throw error;
  }
};