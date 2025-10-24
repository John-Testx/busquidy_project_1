import React from 'react';
// import { useProfileData } from '../../../pages/Empresa/EmpresaProfileLayout'; // Adjust path if needed
import { Outlet, useOutletContext } from 'react-router-dom';


function EmpresaAccess() {
  const { perfilData } = useOutletContext();
  const { perfilUsuario } = perfilData || {};

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de Acceso</h2>
      
      {perfilUsuario ? (
        <div className="space-y-4">
          <ReadOnlyField label="Correo Electrónico de Acceso" value={perfilUsuario.correo} />
          <ReadOnlyField label="Tipo de Usuario" value={perfilUsuario.tipo_usuario} />
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg mt-6">
            <p className="text-sm">
              Para cambiar tu correo electrónico de acceso o contraseña, por favor dirígete a la sección de <strong>Configuración de Cuenta</strong>.
            </p>
          </div>
        </div>
      ) : (
        <p>Cargando información de acceso...</p>
      )}
    </div>
  );
}

// Helper component for displaying non-editable fields
const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <p className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 font-mono">
      {value || 'No disponible'}
    </p>
  </div>
);

export default EmpresaAccess;