import React, { useState } from "react";
import { Shield, Edit2, Trash2, Plus, Lock, AlertCircle } from "lucide-react";
import { useAdminRoles } from "@/hooks";

const AdminRoles = () => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const {
    roles,
    loading,
    error,
    isCreating,
    createRole,
    updateRole,
    deleteRole,
    findRoleById
  } = useAdminRoles();

  /**
   * Maneja la creación de un nuevo rol
   */
  const handleCreateRole = async () => {
    const success = await createRole({
      nombre_rol: newRoleName,
      descripcion: newRoleDesc
    });

    if (success) {
      setNewRoleName("");
      setNewRoleDesc("");
    }
  };

  /**
   * Maneja la actualización de un rol
   */
  const handleUpdateRole = async (id_rol) => {
    const role = findRoleById(id_rol);
    if (!role) return;

    await updateRole(id_rol, {
      nombre_rol: role.nombre_rol,
      descripcion: role.descripcion
    });
  };

  /**
   * Maneja la eliminación de un rol
   */
  const handleDeleteRole = async (id_rol) => {
    await deleteRole(id_rol);
  };

  const roleColors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-purple-600"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800">Roles de Administrador</h2>
          </div>
          <p className="text-gray-600 ml-16">Gestiona los roles y permisos del sistema</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-600 font-medium">Cargando roles...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Roles grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {roles.map((r, idx) => (
                <div
                  key={r.id_rol}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Gradient header */}
                  <div className={`h-32 bg-gradient-to-br ${roleColors[idx % roleColors.length]} p-6 relative`}>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-5 h-5 text-white/90" />
                        <span className="text-white/90 text-sm font-medium">ROL</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white truncate">{r.nombre_rol}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed h-12 overflow-hidden">
                      {r.descripcion || "Sin descripción"}
                    </p>
                    
                    {/* Placeholder for future permissions count */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Permisos</span>
                        <span className="font-semibold">Por configurar</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => handleUpdateRole(r.id_rol)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteRole(r.id_rol)}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new role card */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Agregar Nuevo Rol</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Rol
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Moderador, Editor, Supervisor"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      disabled={isCreating}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      placeholder="Describe las responsabilidades de este rol"
                      value={newRoleDesc}
                      onChange={(e) => setNewRoleDesc(e.target.value)}
                      disabled={isCreating}
                      rows="3"
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <button
                    onClick={handleCreateRole}
                    disabled={isCreating || !newRoleName.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creando...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Crear Rol</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRoles;