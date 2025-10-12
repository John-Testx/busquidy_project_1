import React, { useEffect, useState } from "react";
import AdminTable from "../../common/TableCommon";
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

  useEffect(() => {
    // Fetch users
    fetch("http://localhost:3001/api/users/get/usuarios")
      .then((res) => res.json())
      .then((data) => {
        const usuariosSinAdmin = data.filter(
          (u) => u.tipo_usuario !== "administrador"
        );

        setStats((prev) => ({
          ...prev,
          totalUsuarios: usuariosSinAdmin.length,
          usuariosPremium: usuariosSinAdmin.filter((u) => u.premium === "Sí")
            .length,
        }));

        // Recent users
        const sortedUsers = [...usuariosSinAdmin].sort(
          (a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro)
        );
        setRecentUsers(sortedUsers.slice(0, 5));

        // Chart data (registrations per day)
        const grouped = {};
        usuariosSinAdmin.forEach((u) => {
          const day = new Date(u.fecha_registro).toLocaleDateString("es-CL");
          grouped[day] = (grouped[day] || 0) + 1;
        });
        setUserChartData(
          Object.entries(grouped).map(([day, count]) => ({ day, count }))
        );
      })
      .catch(console.error);

    // Fetch projects
    fetch("http://localhost:3001/api/projects/getProjects")
      .then((res) => res.json())
      .then((data) => {
        const activosCount = data.filter(
          (p) => p.estado_publicacion === "activo"
        ).length;
        setStats((prev) => ({ ...prev, publicacionesActivas: activosCount }));
      })
      .catch(console.error);

    // Fetch payments
    fetch("http://localhost:3001/api/payments/getAll")
      .then((res) => res.json())
      .then((data) => {
        const sortedPayments = [...data].sort(
          (a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago)
        );
        setRecentPayments(sortedPayments.slice(0, 5));

        // Chart data (payments per day)
        const grouped = {};
        data.forEach((p) => {
          const day = new Date(p.fecha_pago).toLocaleDateString("es-CL");
          grouped[day] = (grouped[day] || 0) + Number(p.monto);
        });
        setPaymentChartData(
          Object.entries(grouped).map(([day, total]) => ({ day, total }))
        );
      })
      .catch(console.error);
  }, []);

  // Columns
  const userColumns = [
    { key: "id_usuario", label: "ID" },
    { key: "correo", label: "Correo" },
    { key: "tipo_usuario", label: "Tipo" },
    {
      key: "premium",
      label: "Premium",
      render: (val) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            val === "Sí"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {val}
        </span>
      ),
    },
  ];

  const paymentColumns = [
    { key: "id_pago", label: "ID" },
    { key: "id_usuario", label: "Usuario" },
    {
      key: "monto",
      label: "Monto",
      render: (val) => `$${Number(val).toLocaleString()}`,
    },
    { key: "tipo_pago", label: "Tipo" },
    {
      key: "estado_pago",
      label: "Estado",
      render: (val) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
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

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Usuarios</h3>
          <p className="text-2xl font-bold">{stats.totalUsuarios}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Usuarios Premium</h3>
          <p className="text-2xl font-bold">{stats.usuariosPremium}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Publicaciones Activas</h3>
          <p className="text-2xl font-bold">{stats.publicacionesActivas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Usuarios Activos</h3>
          <p className="text-2xl font-bold">{stats.usuariosActivos}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Usuarios Registrados por Día
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pagos por Día</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={paymentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Usuarios Registrados Recientemente
          </h2>
          <AdminTable
            columns={userColumns}
            data={recentUsers}
            emptyMessage="No hay usuarios recientes"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pagos Recientes</h2>
          <AdminTable
            columns={paymentColumns}
            data={recentPayments}
            emptyMessage="No hay pagos recientes"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
