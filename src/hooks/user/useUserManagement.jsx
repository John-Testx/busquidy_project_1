import { useState, useEffect, useMemo } from 'react';
import { getUsuarios, deleteUsuario, updateUserStatus } from '@/api/userApi';

const useUserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load users
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Delete user
  const eliminarUsuario = async (id_usuario) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await deleteUsuario(id_usuario);
      cargarUsuarios();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert("Error al eliminar el usuario");
    }
  };

  // Toggle user active/inactive
  const toggleUserStatus = async (id_usuario, newStatus) => {
    try {
      await updateUserStatus(id_usuario, newStatus);
      cargarUsuarios();
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("Error al actualizar el estado del usuario");
    }
  };

// Filter users
  const filteredUsers = useMemo(() => {
    return usuarios.filter((user) => {
      
      // AQUÍ ESTÁ EL CAMBIO
      let typeMatch = false;
      if (filterType === "all") {
        typeMatch = true;
      } else if (filterType === "empresa") {
        typeMatch = ["empresa", "empresa_juridico", "empresa_natural"].includes(user.tipo_usuario);
      } else {
        typeMatch = user.tipo_usuario === filterType;
      }

      const statusMatch = 
        filterStatus === "all" || 
        (filterStatus === "active" && user.is_active) || 
        (filterStatus === "inactive" && !user.is_active);
        
      return typeMatch && statusMatch;
    });
  }, [usuarios, filterType, filterStatus]);

// Stats
  const stats = useMemo(() => {
    return {
      total: usuarios.length,
      
      // AQUÍ ESTÁ EL CAMBIO
      empresas: usuarios.filter((u) => 
        ["empresa", "empresa_juridico", "empresa_natural"].includes(u.tipo_usuario)
      ).length,
      
      freelancers: usuarios.filter((u) => u.tipo_usuario === "freelancer").length,
      admins: usuarios.filter((u) => u.tipo_usuario === "administrador").length,
      activos: usuarios.filter((u) => u.is_active).length,
  M };
  }, [usuarios]);

  // Clear filters
  const clearFilters = () => {
    setFilterType("all");
    setFilterStatus("all");
  };

  // Check if filters are active
  const hasActiveFilters = filterType !== "all" || filterStatus !== "all";

  return {
    usuarios,
    loading,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filteredUsers,
    stats,
    eliminarUsuario,
    toggleUserStatus,
    clearFilters,
    hasActiveFilters
  };
};

export default useUserManagement;