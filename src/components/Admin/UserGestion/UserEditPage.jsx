import React from "react";
import { useParams } from "react-router-dom";
import { useUserEditor } from "@/hooks";
import { 
  ArrowLeft, 
  Save, 
  Mail, 
  UserCircle, 
  Shield,
  Loader2,
  AlertCircle 
} from "lucide-react";

const UserEditPage = () => {
  const { id } = useParams();
  const {
    user,
    loading,
    saving,
    error,
    updateField,
    saveUser,
    cancelEdit
  } = useUserEditor(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#07767c] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={cancelEdit}
            className="w-full bg-[#07767c] hover:bg-[#055a5f] text-white font-medium py-3 rounded-lg transition-colors"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={cancelEdit}
            className="flex items-center gap-2 text-gray-600 hover:text-[#07767c] transition-colors mb-4 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver a la lista</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Editar Usuario</h1>
          <p className="text-gray-600 mt-1">Modifica la información del usuario #{id}</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#07767c] to-[#055a5f] px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCircle size={24} />
              Información del Usuario
            </h2>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail size={18} className="text-[#07767c]" />
                Correo Electrónico
              </label>
              <input
                type="email"
                value={user.correo}
                onChange={(e) => updateField('correo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent transition-all outline-none"
                placeholder="usuario@ejemplo.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Asegúrate de que sea un correo válido
              </p>
            </div>

            {/* User Type Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Shield size={18} className="text-[#07767c]" />
                Tipo de Usuario
              </label>
              <select
                value={user.tipo_usuario}
                onChange={(e) => updateField('tipo_usuario', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="freelancer">Freelancer</option>
                <option value="empresa">Empresa</option>
                <option value="administrador">Administrador</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Define el rol y permisos del usuario
              </p>
            </div>

            {/* User Info Display */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Información Adicional
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">ID de Usuario</p>
                  <p className="font-medium text-gray-800">#{user.id_usuario}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estado</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.is_active 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {user.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={cancelEdit}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={saveUser}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;