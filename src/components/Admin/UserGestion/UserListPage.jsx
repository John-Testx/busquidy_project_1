// Creo que no se ocupa este archivo

import React, { useEffect, useState } from "react";
import { getUsuarios } from "@/api/userApi";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { 
  Users, 
  Pencil, 
  Search, 
  UserCircle,
  Building2,
  Shield,
  Loader2 
} from "lucide-react";

const UserListPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsuarios();
        setUsuarios(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = usuarios.filter(
      (user) =>
        user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.tipo_usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, usuarios]);

  const getUserIcon = (tipo) => {
    switch (tipo) {
      case "freelancer":
        return <UserCircle size={20} className="text-green-600" />;
      case "empresa":
        return <Building2 size={20} className="text-blue-600" />;
      case "administrador":
        return <Shield size={20} className="text-purple-600" />;
      default:
        return <UserCircle size={20} className="text-gray-600" />;
    }
  };

  const getUserTypeColor = (tipo) => {
    switch (tipo) {
      case "freelancer":
        return "bg-green-100 text-green-800";
      case "empresa":
        return "bg-blue-100 text-blue-800";
      case "administrador":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#07767c]/10 p-2 rounded-lg">
              <Users className="text-[#07767c]" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
              <p className="text-gray-600">Gestiona todos los usuarios del sistema</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Buscar por correo o tipo de usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-[#07767c]">
            <p className="text-sm text-gray-500 font-medium mb-1">Total Usuarios</p>
            <p className="text-2xl font-bold text-gray-800">{usuarios.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 font-medium mb-1">Empresas</p>
            <p className="text-2xl font-bold text-gray-800">
              {usuarios.filter((u) => u.tipo_usuario === "empresa").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
            <p className="text-sm text-gray-500 font-medium mb-1">Freelancers</p>
            <p className="text-2xl font-bold text-gray-800">
              {usuarios.filter((u) => u.tipo_usuario === "freelancer").length}
            </p>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#07767c] to-[#055a5f] px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              Lista de Usuarios ({filteredUsers.length})
            </h2>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <UserCircle size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No se encontraron usuarios</p>
              <p className="text-sm text-gray-400 mt-1">
                Intenta con otro término de búsqueda
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <li
                  key={user.id_usuario}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getUserIcon(user.tipo_usuario)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-gray-800">
                            {user.correo}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getUserTypeColor(
                              user.tipo_usuario
                            )}`}
                          >
                            {user.tipo_usuario.charAt(0).toUpperCase() +
                              user.tipo_usuario.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          ID: #{user.id_usuario}
                          {user.is_active !== undefined && (
                            <span className="ml-3">
                              Estado:{" "}
                              <span
                                className={
                                  user.is_active
                                    ? "text-green-600 font-medium"
                                    : "text-red-600 font-medium"
                                }
                              >
                                {user.is_active ? "Activo" : "Inactivo"}
                              </span>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-2 bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
                      onClick={() =>
                        navigate(`/admin/users/edit/${user.id_usuario}`)
                      }
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListPage;