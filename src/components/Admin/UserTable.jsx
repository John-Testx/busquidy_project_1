// UserTable.jsx
import React, { useEffect, useState } from "react";
import { Pencil, UserCheck, UserX, Shield, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableCommon from "../../common/TableCommon";
import { getUsuarios, deleteUsuario, updateUserStatus } from "../../api/userApi";
import "../../styles/Admin/UserTable.css";

const UserTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  // Load users
  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
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
    }
  };

  // Toggle user active/inactive
  const toggleUserStatus = async (id_usuario, newStatus) => {
    try {
      await updateUserStatus(id_usuario, newStatus);
      cargarUsuarios();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // Table columns
  const columns = [
    {
      key: "id_usuario",
      label: "ID Usuario",
      sortable: true,
      className: "font-medium text-gray-900"
    },
    {
      key: "correo",
      label: "Correo Electrónico",
      sortable: true,
      className: "text-gray-700"
    },
    {
      key: "tipo_usuario",
      label: "Rol",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "administrador"
              ? "bg-purple-100 text-purple-800"
              : value === "empresa"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: "is_active",
      label: "Estado",
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Activo" : "Inactivo"}
        </span>
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/adminhome/usermanagement/users/edit/${row.id_usuario}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Editar usuario"
          >
            <Pencil size={16} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors duration-200 ${
              row.is_active ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"
            }`}
            onClick={() => toggleUserStatus(row.id_usuario, !row.is_active)}
            title={row.is_active ? "Desactivar usuario" : "Activar usuario"}
          >
            {row.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
          {row.tipo_usuario === "administrador" && (
            <button
              onClick={() => navigate(`/admin/usermanagement/roles/${row.id_usuario}`)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              title="Gestionar roles"
            >
              <Shield size={16} />
            </button>
          )}
          <button
            onClick={() => eliminarUsuario(row.id_usuario)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Eliminar usuario"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="user-management">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <TableCommon
        columns={columns}
        data={usuarios}
        searchPlaceholder="Buscar usuarios..."
        tableClassName="user-table"
        emptyMessage="No hay usuarios registrados"
      />
    </div>
  );
};

export default UserTable;
