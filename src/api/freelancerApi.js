import apiClient from "./apiClient";

const BASE = "/freelancer";
const EMPRESA_BASE = "/empresa";

// =============================================
// PERFIL
// =============================================

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

// export const updateProfileSection = (id_usuario, section, data) =>
//   apiClient.put(`${BASE}/update-freelancer/${id_usuario}/${section}`, data);

/**
 * Obtiene el perfil de la empresa
 * @param {number} id_usuario - ID del usuario empresa
 * @returns {Promise<Object>} Datos del perfil de la empresa
 */
export const getEmpresaProfile = async (id_usuario) => {
  const response = await apiClient.get(`${EMPRESA_BASE}/get/perfil-empresa/${id_usuario}`);
  return response.data;
};

// =============================================
// SECCIONES
// =============================================

export const addItemToSection = (id_usuario, itemType, data) =>
  apiClient.post(`${BASE}/add-freelancer/${id_usuario}/${itemType}`, data);

export const deleteItem = (id_usuario, seccion, id) =>
  apiClient.delete(`${BASE}/delete-idioma-habilidad/${id_usuario}/${seccion}/${id}`);

// =============================================
// CV
// =============================================

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


// =============================================
// CRUD DE SECCIONES DEL PERFIL
// =============================================

/**
 * Agregar un nuevo ítem a una sección del perfil
 * @param {Object} sectionData - { tipo_seccion: 'experiencia', ...datos }
 * @returns {Promise<Object>}
 */
export const addProfileSection = (sectionData) =>
  apiClient.post(`${BASE}/profile/section`, sectionData);

/**
 * Actualizar un ítem existente de una sección
 * @param {number} itemId - ID del ítem a actualizar
 * @param {Object} sectionData - { tipo_seccion: 'experiencia', ...datos }
 * @returns {Promise<Object>}
 */
export const updateProfileSection = (itemId, sectionData) =>
  apiClient.put(`${BASE}/profile/section/${itemId}`, sectionData);

/**
 * Eliminar un ítem de una sección
 * @param {number} itemId - ID del ítem a eliminar
 * @param {string} tipo_seccion - Tipo de sección ('experiencia', 'idioma', etc.)
 * @returns {Promise<Object>}
 */
export const deleteProfileSection = (itemId, tipo_seccion) =>
  apiClient.delete(`${BASE}/profile/section/${itemId}`, { 
    data: { tipo_seccion } 
  });

// =============================================
// POSTULACIONES
// =============================================

/**
 * Crea una nueva postulación a una publicación
 * @param {number} id_publicacion - ID de la publicación
 * @param {number} id_usuario - ID del usuario freelancer
 * @returns {Promise<Object>} Datos de la postulación creada
 */
export const createApplication = (id_publicacion, id_usuario) =>
  apiClient.post(`${BASE}/postulacion/${id_publicacion}`, { id_usuario });

/**
 * Obtiene todas las postulaciones de un freelancer
 * @param {number} id_usuario - ID del usuario freelancer
 * @returns {Promise<Array>} Lista de postulaciones del freelancer
 */
export const getApplications = async (id_usuario) => {
  const response = await apiClient.get(`${BASE}/postulaciones/${id_usuario}`);
  return response.data;
};

/**
 * Elimina una postulación
 * @param {number} id_postulacion - ID de la postulación a eliminar
 * @returns {Promise<Object>} Respuesta de la eliminación
 */
export const deleteApplication = async (id_postulacion) => {
  const response = await apiClient.delete(`${BASE}/delete-postulacion/${id_postulacion}`);
  return response.data;
};

// =============================================
// BÚSQUEDA Y LISTADO - NUEVAS FUNCIONES
// =============================================

/**
 * Obtiene la lista completa de freelancers
 * @returns {Promise<Array>} Lista de freelancers con sus datos
 */
export const listFreelancers = async () => {
  const response = await apiClient.get(`${BASE}/list`);
  return response.data;
};

/**
 * Transforma los datos del freelancer del backend al formato del frontend
 * @param {Object} freelancer - Datos del freelancer desde el backend
 * @returns {Object} Freelancer formateado
 */
export const formatFreelancerData = (freelancer) => ({
  id: freelancer.id_freelancer,
  nombre: freelancer.nombre,
  apellido: freelancer.apellido,
  nacionalidad: freelancer.nacionalidad,
  ubicacion: `${freelancer.ciudad || 'Sin Especificar'}, ${freelancer.comuna || 'Sin Especificar'}`,
  correo: freelancer.correo_contacto,
  telefono: freelancer.telefono_contacto,
  calificacion: freelancer.calificacion_promedio,
  descripcion: freelancer.descripcion,
  habilidades: freelancer.habilidades || ''
});

/**
 * Obtiene y formatea la lista de freelancers
 * @returns {Promise<Array>} Lista de freelancers formateados
 */
export const getFreelancersList = async () => {
  try {
    const data = await listFreelancers();
    return data.map(formatFreelancerData);
  } catch (error) {
    console.error('Error al cargar la lista de freelancers:', error);
    throw error;
  }
};

export const getFreelancerPublicProfile = (id_freelancer) =>
  apiClient.get(`${BASE}/freelancer-perfil/${id_freelancer}`);

/**
 * Obtiene el perfil público del freelancer usando id_usuario
 * @param {number} id_usuario - ID del usuario freelancer
 * @returns {Promise<Object>} Perfil del freelancer
 */
export const getFreelancerPublicProfileByUserId = (id_usuario) =>
  apiClient.get(`${BASE}/perfil-by-user/${id_usuario}`);

// =============================================
// VERIFICACIÓN DE PERFIL
// =============================================

/**
 * Verifica si el perfil del freelancer está completo
 * @param {number} id_usuario - ID del usuario freelancer
 * @returns {Promise<{isPerfilIncompleto: boolean}>}
 */
export const checkFreelancerProfileStatus = async (id_usuario) => {
  try {
    const data = await checkProfileExists(id_usuario);
    return data;
  } catch (error) {
    console.error("Error al verificar el perfil del freelancer:", error);
    throw error;
  }
};

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
 * @param {string} tipo_usuario - Tipo de usuario (freelancer, empresa, empresa_juridico, empresa_natural, administrador)
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
      const data = await checkProfileExists(id_usuario);
      if (data.isPerfilIncompleto) {
        return {
          isComplete: false,
          message: "Completa tu perfil para ser Busquidy +."
        };
      }
      return { isComplete: true };
    } 
    
    // AQUÍ ESTÁ EL CAMBIO
    if (tipo_usuario === "empresa" || tipo_usuario === "empresa_juridico" || tipo_usuario === "empresa_natural") {
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

// =============================================
// FOTO DE PERFIL
// =============================================

/**
 * Subir foto de perfil
 * @param {File} photoFile - Archivo de imagen
 * @param {number} id_usuario - ID del usuario freelancer
 * @returns {Promise<Object>}
 */
export const uploadProfilePhoto = (photoFile, id_usuario) => {
  const formData = new FormData();
  formData.append("photo", photoFile);
  return apiClient.post(`${BASE}/upload-photo/${id_usuario}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Obtener URL de la foto de perfil
 * @param {number} id_usuario - ID del usuario freelancer
 * @returns {Promise<Object>}
 */
export const getProfilePhoto = async (id_usuario) => {
  const response = await apiClient.get(`${BASE}/photo/${id_usuario}`);
  return response.data;
};

// =============================================
// DESCARGA DE CV BUSQUIDY
// =============================================

/**
 * Descargar CV en formato Busquidy (PDF)
 * @param {number} id_usuario - ID del usuario freelancer
 * @returns {Promise<Blob>} Archivo PDF
 */
export const downloadBusquidyCV = async (id_usuario) => {
  const response = await apiClient.get(`${BASE}/download-cv/${id_usuario}`, {
    responseType: 'blob'
  });
  return response.data;
};

// =============================================
// PREFERENCIAS
// =============================================

/**
 * Obtener preferencias del freelancer
 * @param {number} id_usuario - ID del usuario freelancer
 * @returns {Promise<Object>}
 */
export const getPreferencias = async (id_usuario) => {
  const response = await apiClient.get(`${BASE}/preferencias/${id_usuario}`);
  return response.data;
};

/**
 * Actualizar preferencias del freelancer
 * @param {number} id_usuario - ID del usuario freelancer
 * @param {Object} preferencias - { ofertas_empleo, practicas, trabajo_estudiantes }
 * @returns {Promise<Object>}
 */
export const updatePreferencias = async (id_usuario, preferencias) => {
  const response = await apiClient.put(`${BASE}/preferencias/${id_usuario}`, preferencias);
  return response.data;
};