import { useState, useEffect, useCallback } from 'react';
import { getFreelancerPublicProfileByUserId } from '@/api/freelancerApi';

/**
 * Custom hook para gestionar la obtención del perfil público de un freelancer
 * @param {string|number} id_usuario - ID del usuario freelancer
 * @returns {Object} Estado y funciones para gestionar el perfil del freelancer
 */
function useFreelancerProfile(id_usuario) {
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      console.log("Respuesta completa del backend:", response);
      console.log("Datos del freelancer:", response.data);
      
      // Verificar si la respuesta tiene la estructura correcta
      if (response && response.data) {
        setFreelancer(response.data);
      } else {
        throw new Error('Estructura de datos incorrecta');
      }
    } catch (err) {
      console.error("Error al obtener los datos del freelancer:", err);
      console.error("Detalles del error:", err.response);
      setError(err.response?.data?.error || err.message || 'Error al cargar el perfil del freelancer');
    } finally {
      setLoading(false);
    }
  }, [id_usuario]);

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