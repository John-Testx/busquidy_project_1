import { useState, useEffect, useCallback } from 'react';
import { getPublications, createApplication, checkUserApplication } from '@/api/publicationsApi';
import { checkFreelancerProfileStatus } from '@/api/freelancerApi';

/**
 * Custom hook para gestionar publicaciones y postulaciones
 * @param {string} userType - Tipo de usuario
 * @param {number} id_usuario - ID del usuario
 * @param {Object} filters - Filtros aplicados
 * @returns {Object} Estado y funciones para gestionar publicaciones
 */
function usePublications(userType, id_usuario, filters) {
  const [publications, setPublications] = useState([]);
  const [appliedPublications, setAppliedPublications] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState({ show: false, message: '', type: 'success' });

  /**
   * Cargar publicaciones desde la API
   */
  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPublications();
      setPublications(data);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      setModalMessage({
        show: true,
        message: 'Error al cargar las publicaciones',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verificar si el usuario ya postuló a una publicación
   */
  const checkIfApplied = useCallback(async (id_publicacion) => {
    try {
      const { hasApplied } = await checkUserApplication(id_publicacion);
      return hasApplied;
    } catch (error) {
      console.error('Error al verificar postulación:', error);
      return false;
    }
  }, []);

  /**
   * Verificar el perfil del freelancer antes de postular
   */
  const verifyFreelancerProfile = useCallback(async () => {
    if (userType !== 'freelancer' || !id_usuario) {
      return { isComplete: false, message: 'Debes ser freelancer para postular' };
    }

    try {
      const { isPerfilIncompleto } = await checkFreelancerProfileStatus(id_usuario);
      
      if (isPerfilIncompleto) {
        return {
          isComplete: false,
          message: 'Debes completar tu perfil de freelancer para poder postular'
        };
      }
      
      return { isComplete: true };
    } catch (error) {
      console.error('Error al verificar perfil:', error);
      return {
        isComplete: false,
        message: 'Error al verificar tu perfil. Intenta nuevamente.'
      };
    }
  }, [userType, id_usuario]);

  /**
   * Aplicar a una publicación
   */
  const applyToPublication = useCallback(async (id_publicacion) => {
    try {
      // 1. Verificar perfil del freelancer
      const profileCheck = await verifyFreelancerProfile();
      
      if (!profileCheck.isComplete) {
        setModalMessage({
          show: true,
          message: profileCheck.message,
          type: 'warning',
          action: {
            text: 'Completar Perfil',
            link: '/freelancer/create-profile'
          }
        });
        return { success: false, error: 'INCOMPLETE_PROFILE' };
      }

      // 2. Verificar si ya postuló
      const hasApplied = await checkIfApplied(id_publicacion);
      
      if (hasApplied) {
        setModalMessage({
          show: true,
          message: 'Ya has postulado a este proyecto',
          type: 'info'
        });
        return { success: false, error: 'DUPLICATE_APPLICATION' };
      }

      // 3. Crear la postulación
      const response = await createApplication(id_publicacion);
      
      // 4. Actualizar el estado local
      setAppliedPublications(prev => new Set([...prev, id_publicacion]));
      
      setModalMessage({
        show: true,
        message: '¡Postulación enviada exitosamente!',
        type: 'success'
      });

      return { success: true, data: response };
    } catch (error) {
      console.error('Error al postular:', error);
      
      // Manejar diferentes tipos de errores
      const errorData = error.response?.data;
      
      if (errorData?.errorType === 'INCOMPLETE_PROFILE') {
        setModalMessage({
          show: true,
          message: errorData.error || 'Debes completar tu perfil para postular',
          type: 'warning',
          action: {
            text: 'Completar Perfil',
            link: '/freelancer/create-profile'
          }
        });
      } else if (errorData?.errorType === 'DUPLICATE_APPLICATION') {
        setModalMessage({
          show: true,
          message: 'Ya has postulado a este proyecto',
          type: 'info'
        });
        setAppliedPublications(prev => new Set([...prev, id_publicacion]));
      } else {
        setModalMessage({
          show: true,
          message: errorData?.error || 'Error al enviar la postulación. Intenta nuevamente.',
          type: 'error'
        });
      }

      return { success: false, error: errorData?.errorType || 'UNKNOWN_ERROR' };
    }
  }, [verifyFreelancerProfile, checkIfApplied]);

  /**
   * Verificar si una publicación está aplicada
   */
  const isPublicationApplied = useCallback((id_publicacion) => {
    return appliedPublications.has(id_publicacion);
  }, [appliedPublications]);

  /**
   * Cerrar el modal de mensaje
   */
  const closeModal = useCallback(() => {
    setModalMessage({ show: false, message: '', type: 'success' });
  }, []);

  /**
   * Aplicar filtros a las publicaciones
   */
  const filteredPublications = useCallback(() => {
    let filtered = [...publications];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(pub =>
        pub.titulo?.toLowerCase().includes(searchLower) ||
        pub.descripcion?.toLowerCase().includes(searchLower) ||
        pub.habilidades?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.ubicacion) {
      filtered = filtered.filter(pub =>
        pub.ubicacion?.toLowerCase().includes(filters.ubicacion.toLowerCase())
      );
    }

    if (filters.presupuesto) {
      filtered = filtered.filter(pub => {
        const presupuesto = pub.presupuesto?.toLowerCase() || '';
        return presupuesto.includes(filters.presupuesto.toLowerCase());
      });
    }

    if (filters.tipo && filters.tipo !== 'todos') {
      filtered = filtered.filter(pub => pub.tipo === filters.tipo);
    }

    return filtered;
  }, [publications, filters]);

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return {
    publications,
    filteredPublications: filteredPublications(),
    loading,
    modalMessage,
    applyToPublication,
    isPublicationApplied,
    checkIfApplied,
    closeModal,
    refreshPublications: fetchPublications
  };
}

export default usePublications;