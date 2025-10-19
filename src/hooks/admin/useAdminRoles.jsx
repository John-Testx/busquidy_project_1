import { useState, useEffect, useCallback } from "react";
import {
  getAllAdminRoles,
  createAdminRole,
  updateAdminRole,
  deleteAdminRole
} from "@/api/adminApi";

/**
 * Custom hook para gestionar los roles de administrador
 * @returns {Object} Estado y funciones para gestionar roles
 */
export function useAdminRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Obtiene todos los roles de administrador
   */
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllAdminRoles();
      console.log("Roles from API:", data);
      
      setRoles(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error loading admin roles:", err);
      setError(err.message || "Error al cargar los roles");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea un nuevo rol de administrador
   * @param {Object} roleData - Datos del nuevo rol
   * @param {string} roleData.nombre_rol - Nombre del rol
   * @param {string} roleData.descripcion - Descripción del rol
   * @returns {Promise<boolean>} - True si se creó exitosamente
   */
  const createRole = useCallback(async (roleData) => {
    if (!roleData.nombre_rol) {
      alert("Ingresa el nombre del rol");
      return false;
    }

    try {
      setIsCreating(true);
      setError(null);
      
      await createAdminRole(roleData);
      await fetchRoles();
      
      return true;
    } catch (err) {
      console.error("Error creating role:", err);
      setError(err.message || "Error al crear el rol");
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [fetchRoles]);

  /**
   * Actualiza un rol existente
   * @param {number} id_rol - ID del rol a actualizar
   * @param {Object} roleData - Datos actualizados del rol
   * @returns {Promise<boolean>} - True si se actualizó exitosamente
   */
  const updateRole = useCallback(async (id_rol, roleData) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      await updateAdminRole(id_rol, roleData);
      await fetchRoles();
      
      return true;
    } catch (err) {
      console.error("Error updating role:", err);
      setError(err.message || "Error al actualizar el rol");
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchRoles]);

  /**
   * Elimina un rol
   * @param {number} id_rol - ID del rol a eliminar
   * @returns {Promise<boolean>} - True si se eliminó exitosamente
   */
  const deleteRole = useCallback(async (id_rol) => {
    if (!window.confirm("¿Seguro que deseas eliminar este rol?")) {
      return false;
    }

    try {
      setIsDeleting(true);
      setError(null);
      
      await deleteAdminRole(id_rol);
      await fetchRoles();
      
      return true;
    } catch (err) {
      console.error("Error deleting role:", err);
      setError(err.message || "Error al eliminar el rol");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [fetchRoles]);

  /**
   * Busca un rol específico por ID
   * @param {number} id_rol - ID del rol a buscar
   * @returns {Object|undefined} - Rol encontrado o undefined
   */
  const findRoleById = useCallback((id_rol) => {
    return roles.find(r => r.id_rol === id_rol);
  }, [roles]);

  /**
   * Recarga los roles manualmente
   */
  const refreshRoles = useCallback(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Carga inicial de roles
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    createRole,
    updateRole,
    deleteRole,
    findRoleById,
    refreshRoles
  };
}