import React, { useEffect, useState } from "react";
import AdminTable from "@/common/TableCommon";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { 
  Users, 
  Crown, 
  FileText, 
  Activity,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { getUsuarios } from "@/api/userApi";
import { getAllProjects } from "@/api/projectsApi";
import { getAllPayments } from "@/api/paymentApi";

function Dashboard() {
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersData = await getUsuarios();
        const usuariosSinAdmin = usersData.filter(
          (u) => u.tipo_usuario !== "administrador"
        );
        
        setStats((prev) => ({
          ...prev,
          totalUsuarios: usuariosSinAdmin.length,
          usuariosPremium: usuariosSinAdmin.filter((u) => u.premium === "Sí").length,
        }));

        // Recent users
        const sortedUsers = [...usuariosSinAdmin].sort(
          (a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro)
        );
        setRecentUsers(sortedUsers.slice(0, 5));

        // User chart data
        const userGrouped = {};
        usuariosSinAdmin.forEach((u) => {
          const day = new Date(u.fecha_registro).toLocaleDateString("es-CL");
          userGrouped[day] = (userGrouped[day] || 0) + 1;
        });
        setUserChartData(
          Object.entries(userGrouped).map(([day, count]) => ({ day, count }))
        );

        // Fetch projects
        const projectsResponse = await getAllProjects();
        const projectsData = projectsResponse.data;
        const activosCount = projectsData.filter(
          (p) => p.estado_publicacion === "activo"
        ).length;
        setStats((prev) => ({ ...prev, publicacionesActivas: activosCount }));

        // Fetch payments
        const paymentsResponse = await getAllPayments();
        const paymentsData = paymentsResponse.data;
        
        const sortedPayments = [...paymentsData].sort(
          (a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago)
        );
        setRecentPayments(sortedPayments.slice(0, 5));

        // Payment chart data
        const paymentGrouped = {};
        paymentsData.forEach((p) => {
          const day = new Date(p.fecha_pago).toLocaleDateString("es-CL");
          paymentGrouped[day] = (paymentGrouped[day] || 0) + Number(p.monto);
        });
        setPaymentChartData(
          Object.entries(paymentGrouped).map(([day, total]) => ({ day, total }))
        );

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Columns
  const userColumns = [
    { key: "id_usuario", label: "ID", sortable: true },
    { key: "correo", label: "Correo", sortable: true },
    { key: "tipo_usuario", label: "Tipo", sortable: true },
    {
      key: "premium",
      label: "Premium",
      render: (val) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            val === "Sí"
              ? "bg-amber-100 text-amber-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {val}
        </span>
      ),
    },
  ];

  const paymentColumns = [
    { key: "id_pago", label: "ID", sortable: true },
    { key: "id_usuario", label: "Usuario", sortable: true },
    {
      key: "monto",
      label: "Monto",
      sortable: true,
      render: (val) => `$${Number(val).toLocaleString('es-CL')}`,
    },
    { key: "tipo_pago", label: "Tipo", sortable: true },
    {
      key: "estado_pago",
      label: "Estado",
      render: (val) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            val === "completado"
              ? "bg-green-100 text-green-800"
              : val === "pendiente"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: "fecha_pago",
      label: "Fecha",
      sortable: true,
      render: (val) =>
        new Date(val).toLocaleString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#07767c] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general de la plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#07767c]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsuarios}</p>
            </div>
            <div className="bg-[#07767c]/10 p-3 rounded-full">
              <Users className="text-[#07767c]" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Usuarios Premium</p>
              <p className="text-3xl font-bold text-gray-800">{stats.usuariosPremium}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Crown className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Publicaciones Activas</p>
              <p className="text-3xl font-bold text-gray-800">{stats.publicacionesActivas}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Usuarios Activos</p>
              <p className="text-3xl font-bold text-gray-800">{stats.usuariosActivos}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Activity className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#07767c]/10 p-2 rounded-lg">
              <TrendingUp className="text-[#07767c]" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Usuarios Registrados por Día
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#07767c" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payments Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Pagos por Día
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => `$${Number(value).toLocaleString('es-CL')}`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#07767c] to-[#055a5f] px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              Usuarios Registrados Recientemente
            </h2>
          </div>
          <div className="p-6">
            <AdminTable
              columns={userColumns}
              data={recentUsers}
              emptyMessage="No hay usuarios recientes"
              tableClassName="text-sm"
            />
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              Pagos Recientes
            </h2>
          </div>
          <div className="p-6">
            <AdminTable
              columns={paymentColumns}
              data={recentPayments}
              emptyMessage="No hay pagos recientes"
              tableClassName="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;