import { useState, useEffect, useCallback } from 'react';
import { getProjects, deleteProject, checkCompanyProfile } from '@/api/projectsApi';
import { toast } from 'react-toastify';

/**
 * Custom hook para gestionar proyectos de una empresa
 * @param {Object} options - Opciones del hook
 * @param {string} options.userType - Tipo de usuario
 * @param {number} options.id_usuario - ID del usuario
 * @returns {Object} Estado y funciones para gestionar proyectos
 */
function useCompanyProjects({ userType, id_usuario }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  /**
   * Carga los proyectos del usuario
   */
  const loadProjects = useCallback(async () => {
    const isEmpresa = userType && userType.startsWith('empresa');
    
    if (!isEmpresa || !id_usuario) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await getProjects(id_usuario);
      setProjects(data);
    } catch (err) {
      console.error('Error al cargar proyectos:', err);
      setError('Error al cargar proyectos');
      toast.error('Algo salió mal al cargar los proyectos.');
    } finally {
      setLoading(false);
    }
  }, [userType, id_usuario]);

  /**
   * Verifica si el perfil de la empresa está completo
   */
  const checkProfile = useCallback(async () => {
    if (!id_usuario) return;

    try {
      const isIncomplete = await checkCompanyProfile(id_usuario);
      setIsProfileComplete(!isIncomplete);
      return !isIncomplete;
    } catch (err) {
      console.error('Error al verificar perfil:', err);
      return false;
    }
  }, [id_usuario]);

  /**
   * Agrega un nuevo proyecto a la lista
   * @param {Object} newProject - Nuevo proyecto
   */
  const addProject = useCallback((newProject) => {
    setProjects(prev => [newProject, ...prev]);
  }, []);

  /**
   * Elimina un proyecto
   * @param {number} projectId - ID del proyecto a eliminar
   */
  const removeProject = useCallback(async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id_proyecto !== projectId));
      toast.success('Proyecto eliminado correctamente');
      return true;
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
      toast.error('Error al eliminar proyecto');
      return false;
    }
  }, []);

  /**
   * Actualiza un proyecto en la lista
   * @param {number} projectId - ID del proyecto
   * @param {Object} updatedData - Datos actualizados
   */
  const updateProjectInList = useCallback((projectId, updatedData) => {
    setProjects(prev =>
      prev.map(p => (p.id_proyecto === projectId ? { ...p, ...updatedData } : p))
    );
  }, []);

  /**
   * Recarga los proyectos
   */
  const refreshProjects = useCallback(() => {
    loadProjects();
  }, [loadProjects]);

  // Carga inicial de proyectos
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    isProfileComplete,
    addProject,
    removeProject,
    updateProjectInList,
    refreshProjects,
    checkProfile,
  };
}

export default useCompanyProjects;