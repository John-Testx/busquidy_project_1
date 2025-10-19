import { useState, useEffect, useCallback } from 'react';
import { getFreelancerPublicProfile } from '@/api/freelancerApi';

/**
 * Custom hook para gestionar la obtención del perfil público de un freelancer
 * @param {string|number} id_freelancer - ID del freelancer a obtener
 * @returns {Object} Estado y funciones para gestionar el perfil del freelancer
 */
function useFreelancerProfile(id_freelancer) {
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Obtiene los datos del perfil del freelancer
   */
  const fetchFreelancerProfile = useCallback(async () => {
    if (!id_freelancer) {
      setError('ID de freelancer no proporcionado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getFreelancerPublicProfile(id_freelancer);
      console.log("Datos recibidos del backend:", response.data);
      
      setFreelancer(response.data);
    } catch (err) {
      console.error("Error al obtener los datos del freelancer:", err);
      setError(err.response?.data?.message || 'Error al cargar el perfil del freelancer');
    } finally {
      setLoading(false);
    }
  }, [id_freelancer]);

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
    freelancer,
    loading,
    error,
    refreshProfile
  };
}

export default useFreelancerProfile;