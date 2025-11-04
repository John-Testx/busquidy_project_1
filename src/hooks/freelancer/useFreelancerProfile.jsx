import { useState, useEffect, useCallback } from 'react';
import { 
  getFreelancerPublicProfileByUserId,
  addProfileSection,
  updateProfileSection,
  deleteProfileSection
} from '@/api/freelancerApi';

/**
 * Custom hook para gestionar el perfil del freelancer con funcionalidad CRUD
 * @param {string|number} id_usuario - ID del usuario freelancer
 * @returns {Object} Estado y funciones para gestionar el perfil
 */
function useFreelancerProfile(id_usuario) {
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el modal
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null, // 'add' o 'edit'
    sectionName: null, // 'experiencia', 'educacion_superior', etc.
    currentItem: null // Datos del ítem cuando es 'edit'
  });

  /**
   * Obtiene los datos del perfil del freelancer
   */
  const fetchFreelancerProfile = useCallback(async () => {
    if (!id_usuario) {
      setError('ID de usuario no proporcionado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Obteniendo perfil para id_usuario:", id_usuario);
      
      const response = await getFreelancerPublicProfileByUserId(id_usuario);
      
      if (response && response.data) {
        setFreelancer(response.data);
      } else {
        throw new Error('Estructura de datos incorrecta');
      }
    } catch (err) {
      console.error("Error al obtener los datos del freelancer:", err);
      setError(err.response?.data?.error || err.message || 'Error al cargar el perfil del freelancer');
    } finally {
      setLoading(false);
    }
  }, [id_usuario]);

  /**
   * Abrir modal en modo "agregar"
   */
  const openAddModal = useCallback((sectionName) => {
    setModalState({
      isOpen: true,
      mode: 'add',
      sectionName,
      currentItem: null
    });
  }, []);

  /**
   * Abrir modal en modo "editar"
   */
  const openEditModal = useCallback((sectionName, itemData) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      sectionName,
      currentItem: itemData
    });
  }, []);

  /**
   * Cerrar modal
   */
  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: null,
      sectionName: null,
      currentItem: null
    });
  }, []);

  /**
   * Manejar el submit para agregar un nuevo ítem
   */
  const handleAddSubmit = useCallback(async (formData) => {
    try {
      setLoading(true);
      
      await addProfileSection({
        tipo_seccion: modalState.sectionName,
        ...formData
      });

      // Refrescar datos del perfil
      await fetchFreelancerProfile();
      
      closeModal();
      
      return { success: true, message: 'Ítem agregado exitosamente' };
    } catch (err) {
      console.error("Error al agregar ítem:", err);
      return { 
        success: false, 
        message: err.response?.data?.error || 'Error al agregar el ítem' 
      };
    } finally {
      setLoading(false);
    }
  }, [modalState.sectionName, fetchFreelancerProfile, closeModal]);

  /**
   * Manejar el submit para editar un ítem existente
   */
  const handleEditSubmit = useCallback(async (itemId, formData) => {
    try {
      setLoading(true);
      
      await updateProfileSection(itemId, {
        tipo_seccion: modalState.sectionName,
        ...formData
      });

      // Refrescar datos del perfil
      await fetchFreelancerProfile();
      
      closeModal();
      
      return { success: true, message: 'Ítem actualizado exitosamente' };
    } catch (err) {
      console.error("Error al actualizar ítem:", err);
      return { 
        success: false, 
        message: err.response?.data?.error || 'Error al actualizar el ítem' 
      };
    } finally {
      setLoading(false);
    }
  }, [modalState.sectionName, fetchFreelancerProfile, closeModal]);

  /**
   * Eliminar un ítem
   */
  const handleDelete = useCallback(async (itemId, sectionName) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      return;
    }

    try {
      setLoading(true);
      
      await deleteProfileSection(itemId, sectionName);

      // Refrescar datos del perfil
      await fetchFreelancerProfile();
      
      return { success: true, message: 'Ítem eliminado exitosamente' };
    } catch (err) {
      console.error("Error al eliminar ítem:", err);
      return { 
        success: false, 
        message: err.response?.data?.error || 'Error al eliminar el ítem' 
      };
    } finally {
      setLoading(false);
    }
  }, [fetchFreelancerProfile]);

  /**
   * Recarga el perfil del freelancer
   */
  const refreshProfile = useCallback(() => {
    fetchFreelancerProfile();
  }, [fetchFreelancerProfile]);

  // Carga inicial del perfil
  useEffect(() => {
    fetchFreelancerProfile();
  }, [fetchFreelancerProfile]);

  return {
    // Datos del perfil
    freelancer,
    loading,
    error,
    refreshProfile,
    
    // Estado y funciones del modal
    modalState,
    openAddModal,
    openEditModal,
    closeModal,
    
    // Funciones CRUD
    handleAddSubmit,
    handleEditSubmit,
    handleDelete
  };
}

export default useFreelancerProfile;