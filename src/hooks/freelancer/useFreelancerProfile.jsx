import { useState, useEffect, useCallback } from 'react';
import { 
  getFreelancerPublicProfileByUserId,
  addProfileSection,
  updateProfileSection,
  deleteProfileSection,
  uploadProfilePhoto,
  getProfilePhoto,
  downloadBusquidyCV,
  getPreferencias,
  updatePreferencias
} from '@/api/freelancerApi';

/**
 * Custom hook para gestionar el perfil del freelancer con funcionalidad CRUD completa
 * @param {string|number} id_usuario - ID del usuario freelancer
 * @returns {Object} Estado y funciones para gestionar el perfil
 */
function useFreelancerProfile(id_usuario) {
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [preferencias, setPreferencias] = useState(null);
  
  // Estado para el modal
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,
    sectionName: null,
    currentItem: null
  });

  // Estado para el modal de preferencias
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

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
      console.error("Error al obtener los datos del estudiante:", err);
      setError(err.response?.data?.error || err.message || 'Error al cargar el perfil del estudiante');
    } finally {
      setLoading(false);
    }
  }, [id_usuario]);

  /**
   * Obtiene la foto de perfil
   */
  const fetchProfilePhoto = useCallback(async () => {
    if (!id_usuario) return;

    try {
      const response = await getProfilePhoto(id_usuario);
      setPhotoUrl(response.photo_url);
    } catch (err) {
      console.error("Error al obtener foto de perfil:", err);
    }
  }, [id_usuario]);

  /**
   * Obtiene las preferencias del freelancer
   */
  const fetchPreferencias = useCallback(async () => {
    if (!id_usuario) return;

    try {
      const response = await getPreferencias(id_usuario);
      setPreferencias(response.preferencias);
    } catch (err) {
      console.error("Error al obtener preferencias:", err);
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
   * Subir foto de perfil
   */
  const handleUploadPhoto = useCallback(async (photoFile) => {
    try {
      setLoading(true);
      
      const response = await uploadProfilePhoto(photoFile, id_usuario);
      setPhotoUrl(response.photo_url);
      await fetchFreelancerProfile();
      
      return { success: true, message: 'Foto actualizada exitosamente' };
    } catch (err) {
      console.error("Error al subir foto:", err);
      return { 
        success: false, 
        message: err.response?.data?.error || 'Error al subir la foto' 
      };
    } finally {
      setLoading(false);
    }
  }, [id_usuario, fetchFreelancerProfile]);

  /**
   * Descargar CV en formato Busquidy
   */
  const handleDownloadCV = useCallback(async () => {
    try {
      const blob = await downloadBusquidyCV(id_usuario);
      
      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_Busquidy_${id_usuario}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'CV descargado exitosamente' };
    } catch (err) {
      console.error("Error al descargar CV:", err);
      return { 
        success: false, 
        message: err.response?.data?.error || 'Error al descargar el CV' 
      };
    }
  }, [id_usuario]);

  /**
   * Actualizar preferencias
   */
  const handleUpdatePreferencias = useCallback(async (newPreferencias) => {
    try {
      setLoading(true);
      
      await updatePreferencias(id_usuario, newPreferencias);
      setPreferencias(newPreferencias);
      setPreferencesModalOpen(false);
      
      return { success: true, message: 'Preferencias actualizadas exitosamente' };
    } catch (err) {
      console.error("Error al actualizar preferencias:", err);
      return { 
        success: false, 
        message: err.response?.data?.error || 'Error al actualizar preferencias' 
      };
    } finally {setLoading(false);
    }
  }, [id_usuario]);

  /**
   * Recarga el perfil del freelancer
   */
  const refreshProfile = useCallback(() => {
    fetchFreelancerProfile();
    fetchProfilePhoto();
    fetchPreferencias();
  }, [fetchFreelancerProfile, fetchProfilePhoto, fetchPreferencias]);

  // Carga inicial del perfil
  useEffect(() => {
    fetchFreelancerProfile();
    fetchProfilePhoto();
    fetchPreferencias();
  }, [fetchFreelancerProfile, fetchProfilePhoto, fetchPreferencias]);

  return {
    // Datos del perfil
    freelancer,
    loading,
    error,
    photoUrl,
    preferencias,
    refreshProfile,
    
    // Estado y funciones del modal
    modalState,
    openAddModal,
    openEditModal,
    closeModal,
    
    // Funciones CRUD
    handleAddSubmit,
    handleEditSubmit,
    handleDelete,
    
    // Funciones de foto de perfil
    handleUploadPhoto,
    
    // Funciones de CV
    handleDownloadCV,
    
    // Funciones de preferencias
    preferencesModalOpen,
    setPreferencesModalOpen,
    handleUpdatePreferencias
  };
}

export default useFreelancerProfile;