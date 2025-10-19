import { useState, useEffect, useCallback } from 'react';
import { getFreelancersList, checkFreelancerProfileStatus } from '@/api/freelancerApi';

/**
 * Custom hook para gestionar el estado y la lógica de freelancers
 * @param {Object} options - Opciones del hook
 * @param {string} options.userType - Tipo de usuario actual
 * @param {number} options.id_usuario - ID del usuario actual
 * @returns {Object} Estado y funciones para gestionar freelancers
 */
function useFreelancers({ userType, id_usuario }) {
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileWarning, setProfileWarning] = useState(null);

  /**
   * Carga la lista de freelancers desde el backend
   */
  const loadFreelancers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getFreelancersList();
      setFreelancers(data);
      setFilteredFreelancers(data);
    } catch (err) {
      console.error('Error al cargar freelancers:', err);
      setError('No se pudo cargar la lista de freelancers. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verifica el estado del perfil del freelancer actual
   */
  const checkCurrentUserProfile = useCallback(async () => {
    if (userType === 'freelancer' && id_usuario) {
      try {
        const response = await checkFreelancerProfileStatus(id_usuario);
        if (response.isPerfilIncompleto) {
          setProfileWarning('Completa tu perfil para aparecer en la lista de freelancers.');
        }
      } catch (err) {
        console.error("Error al verificar el perfil del freelancer:", err);
      }
    }
  }, [userType, id_usuario]);

  /**
   * Aplica filtros a la lista de freelancers
   * @param {Object} filters - Filtros a aplicar
   * @param {string} filters.search - Búsqueda por nombre
   * @param {string} filters.location - Filtro por ubicación
   * @param {number} filters.rating - Filtro por calificación mínima
   * @param {string} filters.skills - Filtro por habilidades
   */
  const applyFilters = useCallback((filters) => {
    let result = [...freelancers];

    if (filters.search) {
      result = result.filter(f => 
        `${f.nombre} ${f.apellido}`.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      result = result.filter(f => 
        f.ubicacion.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.rating) {
      result = result.filter(f => 
        Math.floor(f.calificacion) >= filters.rating
      );
    }

    if (filters.skills) {
      const skillsArray = filters.skills.toLowerCase().split(',').map(s => s.trim());
      result = result.filter(f => 
        skillsArray.some(skill => 
          f.habilidades.toLowerCase().includes(skill)
        )
      );
    }

    setFilteredFreelancers(result);
  }, [freelancers]);

  /**
   * Reinicia los filtros mostrando todos los freelancers
   */
  const resetFilters = useCallback(() => {
    setFilteredFreelancers(freelancers);
  }, [freelancers]);

  /**
   * Recarga la lista de freelancers
   */
  const refreshFreelancers = useCallback(() => {
    loadFreelancers();
  }, [loadFreelancers]);

  // Carga inicial de freelancers
  useEffect(() => {
    loadFreelancers();
  }, [loadFreelancers]);

  // Verificación del perfil del usuario
  useEffect(() => {
    checkCurrentUserProfile();
  }, [checkCurrentUserProfile]);

  return {
    freelancers: filteredFreelancers,
    allFreelancers: freelancers,
    loading,
    error,
    profileWarning,
    applyFilters,
    resetFilters,
    refreshFreelancers
  };
}

export default useFreelancers;