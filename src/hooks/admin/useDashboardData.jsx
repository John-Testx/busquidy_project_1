import { useState, useEffect, useCallback } from "react";
import { getUsuarios } from "@/api/userApi";
import { getAllProjects } from "@/api/projectsApi";
import { getProjectPayments, getSubscriptionPayments } from "@/api/paymentApi";

/**
 * Custom hook para gestionar los datos del dashboard de administración
 * @returns {Object} Estado y datos del dashboard
 */
export function useDashboardData() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosPremium: 0,
    publicacionesActivas: 0,
    usuariosActivos: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [paymentChartData, setPaymentChartData] = useState([]);
  const [userChartData, setUserChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Procesa los datos de usuarios para estadísticas y gráficos
   * @param {Array} usersData - Datos de usuarios desde la API
   */
  const processUsersData = useCallback((usersData) => {
    // Filtrar usuarios sin administradores
    const usuariosSinAdmin = usersData.filter(
      (u) => u.tipo_usuario !== "administrador"
    );

    // Actualizar estadísticas
    setStats((prev) => ({
      ...prev,
      totalUsuarios: usuariosSinAdmin.length,
      usuariosPremium: usuariosSinAdmin.filter((u) => u.premium === "Sí").length,
    }));

    // Usuarios recientes (últimos 5)
    const sortedUsers = [...usuariosSinAdmin].sort(
      (a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro)
    );
    setRecentUsers(sortedUsers.slice(0, 5));

    // Datos para el gráfico de usuarios por día
    const userGrouped = {};
    usuariosSinAdmin.forEach((u) => {
      const day = new Date(u.fecha_registro).toLocaleDateString("es-CL");
      userGrouped[day] = (userGrouped[day] || 0) + 1;
    });
    setUserChartData(
      Object.entries(userGrouped).map(([day, count]) => ({ day, count }))
    );
  }, []);

  /**
   * Procesa los datos de proyectos para estadísticas
   * @param {Array} projectsData - Datos de proyectos desde la API
   */
  const processProjectsData = useCallback((projectsData) => {
    const activosCount = projectsData.filter(
      (p) => p.estado_publicacion === "activo"
    ).length;
    
    setStats((prev) => ({ 
      ...prev, 
      publicacionesActivas: activosCount 
    }));
  }, []);

  /**
   * Procesa los datos de pagos para estadísticas y gráficos
   * @param {Array} paymentsData - Datos de pagos desde la API
   */
  const processPaymentsData = useCallback((paymentsData) => {
    // Pagos recientes (últimos 5)
    const sortedPayments = [...paymentsData].sort(
      (a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago)
    );
    setRecentPayments(sortedPayments.slice(0, 5));

    // Datos para el gráfico de pagos por día
    const paymentGrouped = {};
    paymentsData.forEach((p) => {
      const day = new Date(p.fecha_pago).toLocaleDateString("es-CL");
      paymentGrouped[day] = (paymentGrouped[day] || 0) + Number(p.monto);
    });
    setPaymentChartData(
      Object.entries(paymentGrouped).map(([day, total]) => ({ day, total }))
    );
  }, []);

  /**
   * Obtiene todos los datos del dashboard
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [usersData, projectsResponse, projectPaymentsResponse, subscriptionPaymentsResponse] = await Promise.all([
        getUsuarios(),
        getAllProjects(),
        getProjectPayments(),
        getSubscriptionPayments()
      ]);

      // Process users data
      processUsersData(usersData);

      // Process projects data
      const projectsData = projectsResponse.data;
      processProjectsData(projectsData);

      const allPaymentsData = [
                ...projectPaymentsResponse.data, 
                ...subscriptionPaymentsResponse.data
            ];
      processPaymentsData(allPaymentsData);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  }, [processUsersData, processProjectsData, processPaymentsData]);

  /**
   * Recarga los datos del dashboard manualmente
   */
  const refreshDashboard = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Carga inicial de datos
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    recentUsers,
    recentPayments,
    paymentChartData,
    userChartData,
    loading,
    error,
    refreshDashboard
  };
}