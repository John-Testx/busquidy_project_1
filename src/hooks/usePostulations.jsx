import { useState, useEffect, useCallback } from 'react';
import { getApplications, deleteApplication } from '@/api/freelancerApi';

/**
 * Custom hook para gestionar las postulaciones de un freelancer
 * @param {number} id_usuario - ID del usuario freelancer
 * @returns {Object} Estado y funciones para gestionar postulaciones
 */
function usePostulations(id_usuario) {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Estado");
  
  const itemsPerPage = 4;

  /**
   * Calcula el tiempo transcurrido desde una fecha
   * @param {string} postDate - Fecha de publicación
   * @returns {string} Tiempo transcurrido formateado
   */
  const calculateTimeAgo = useCallback((postDate) => {
    const postDateObj = new Date(postDate);
    const now = new Date();
    const differenceInMs = now - postDateObj;
    const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    
    if (daysAgo < 1) return "Hoy";
    if (daysAgo === 1) return "Hace 1 día";
    if (daysAgo < 7) return `Hace ${daysAgo} días`;
    if (daysAgo < 30) return `Hace ${Math.floor(daysAgo / 7)} semanas`;
    return `Hace ${Math.floor(daysAgo / 30)} meses`;
  }, []);

  /**
   * Carga las postulaciones del freelancer
   */
  const fetchPostulations = useCallback(async () => {
    if (!id_usuario || isNaN(id_usuario)) {
      console.error("ID de usuario inválido:", id_usuario);
      setError("ID de usuario inválido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await getApplications(id_usuario);
      
      if (data) {
        setPostulations(data);
      }
    } catch (err) {
      console.error("Error al cargar las postulaciones:", err);
      setError("Error al cargar las postulaciones");
    } finally {
      setLoading(false);
    }
  }, [id_usuario]);

  /**
   * Elimina una postulación
   * @param {number} id_postulacion - ID de la postulación a eliminar
   */
  const removePostulation = useCallback(async (id_postulacion) => {
    try {
      await deleteApplication(id_postulacion);
      
      // Actualizar el estado local eliminando la postulación
      setPostulations(prevPostulations => 
        prevPostulations.filter(p => p.id_postulacion !== id_postulacion)
      );

      // Si la página actual queda vacía, retroceder una página
      const totalPages = Math.ceil((postulations.length - 1) / itemsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Error al eliminar la postulación:", err);
      throw err;
    }
  }, [postulations.length, currentPage, itemsPerPage]);

  /**
   * Cambia la página actual
   * @param {number} page - Número de página
   */
  const handlePageChange = useCallback((page) => {
    const totalPages = Math.ceil(postulations.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [postulations.length, itemsPerPage]);

  /**
   * Cambia la opción de ordenamiento
   * @param {string} option - Opción de ordenamiento seleccionada
   */
  const handleSortChange = useCallback((option) => {
    setSortOption(option);
  }, []);

  /**
   * Obtiene las postulaciones de la página actual
   */
  const getCurrentPagePostulations = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return postulations.slice(startIndex, endIndex);
  }, [postulations, currentPage, itemsPerPage]);

  /**
   * Calcula el total de páginas
   */
  const getTotalPages = useCallback(() => {
    return Math.ceil(postulations.length / itemsPerPage) || 1;
  }, [postulations.length, itemsPerPage]);

  /**
   * Recarga las postulaciones
   */
  const refreshPostulations = useCallback(() => {
    fetchPostulations();
  }, [fetchPostulations]);

  // Carga inicial de postulaciones
  useEffect(() => {
    fetchPostulations();
  }, [fetchPostulations]);

  return {
    postulations,
    loading,
    error,
    currentPage,
    sortOption,
    itemsPerPage,
    calculateTimeAgo,
    removePostulation,
    handlePageChange,
    handleSortChange,
    getCurrentPagePostulations,
    getTotalPages,
    refreshPostulations
  };
}

export default usePostulations;