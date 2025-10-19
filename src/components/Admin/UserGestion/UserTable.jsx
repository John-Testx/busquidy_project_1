import React from "react";
import { 
  Pencil, 
  UserCheck, 
  UserX, 
  Shield, 
  Trash2,
  Users,
  Filter,
  Download,
  UserCircle,
  Building2,
  Crown,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableCommon from "@/common/TableCommon";
import { useUserManagement } from "@/hooks";

const UserTable = () => {
  const navigate = useNavigate();
  const {
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
  } = useUserManagement();

  // Table columns
  const columns = [
    {
      key: "id_usuario",
      label: "ID",
      sortable: true,
      className: "font-semibold text-gray-900"
    },
    {
      key: "correo",
      label: "Correo Electrónico",
      sortable: true,
      className: "text-gray-700",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-full flex items-center justify-center text-white text-xs font-bold">
            {value.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: "tipo_usuario",
      label: "Tipo de Usuario",
      sortable: true,
      render: (value) => {
        const config = {
          administrador: {
            bg: "bg-purple-100",
            text: "text-purple-800",
            icon: <Shield size={14} />,
          },
          empresa: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            icon: <Building2 size={14} />,
          },
          freelancer: {
            bg: "bg-green-100",
            text: "text-green-800",
            icon: <UserCircle size={14} />,
          },
        };

        const style = config[value] || config.freelancer;

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
          >
            {style.icon}
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    },
    {
      key: "premium",
      label: "Premium",
      render: (value) => (
        value === "Sí" ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Crown size={14} />
            Premium
          </span>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )
      )
    },
    {
      key: "is_active",
      label: "Estado",
      render: (value) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            value ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${value ? "bg-emerald-500" : "bg-red-500"}`}></div>
          {value ? "Activo" : "Inactivo"}
        </span>
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/adminhome/usermanagement/users/edit/${row.id_usuario}`)}
            className="p-2 text-[#07767c] hover:bg-[#07767c]/10 rounded-lg transition-all duration-200 hover:scale-110"
            title="Editar usuario"
          >
            <Pencil size={16} />
          </button>
          <button
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
              row.is_active 
                ? "text-orange-600 hover:bg-orange-50" 
                : "text-green-600 hover:bg-green-50"
            }`}
            onClick={() => toggleUserStatus(row.id_usuario, !row.is_active)}
            title={row.is_active ? "Desactivar usuario" : "Activar usuario"}
          >
            {row.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
          {row.tipo_usuario === "administrador" && (
            <button
              onClick={() => navigate(`/admin/usermanagement/roles/${row.id_usuario}`)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-110"
              title="Gestionar roles"
            >
              <Shield size={16} />
            </button>
          )}
          <button
            onClick={() => eliminarUsuario(row.id_usuario)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="Eliminar usuario"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#07767c] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#07767c] to-[#055a5f] p-3 rounded-xl shadow-lg">
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra y controla los usuarios de la plataforma</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={18} />
          Exportar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#07767c]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-[#07767c]/10 p-3 rounded-full">
              <Users className="text-[#07767c]" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Empresas</p>
              <p className="text-3xl font-bold text-gray-800">{stats.empresas}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Freelancers</p>
              <p className="text-3xl font-bold text-gray-800">{stats.freelancers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Admins</p>
              <p className="text-3xl font-bold text-gray-800">{stats.admins}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Shield className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Activos</p>
              <p className="text-3xl font-bold text-gray-800">{stats.activos}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <div className="w-6 h-6 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Filter size={20} className="text-[#07767c]" />
          <h3 className="font-semibold text-gray-800">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuario
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent transition-all outline-none"
            >
              <option value="all">Todos</option>
              <option value="empresa">Empresas</option>
              <option value="freelancer">Freelancers</option>
              <option value="administrador">Administradores</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent transition-all outline-none"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#07767c] to-[#055a5f] px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Lista de Usuarios ({filteredUsers.length})
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-white/90 hover:text-white underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No se encontraron usuarios</p>
              <p className="text-sm text-gray-400 mt-1">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            <TableCommon
              columns={columns}
              data={filteredUsers}
              searchPlaceholder="Buscar por correo, ID o tipo..."
              emptyMessage="No hay usuarios que coincidan con la búsqueda"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTable;