import React from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../../api/apiClient';
import axios from 'axios';
// import { useProfileData } from '../../../pages/Empresa/EmpresaProfileLayout'; // Adjust path if needed
import { Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '@/hooks/index';

function RepresentanteInfo() {
    const { perfilData, setPerfilData, handleUpdateProfile } = useOutletContext();
    const { id_usuario } = useAuth();

  // Handle changes for the 'perfilRepresentante' section
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfilData(prev => ({
      ...prev,
      perfilRepresentante: { ...prev.perfilRepresentante, [name]: value }
    }));
  };

  const handleSave = async () => {
    handleUpdateProfile();
  };

  const { perfilRepresentante } = perfilData || {};

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Información del Representante</h2>
      
      {perfilRepresentante ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Nombre Completo" name="nombre_completo" value={perfilRepresentante.nombre_completo} onChange={handleChange} />
          <InputField label="Cargo" name="cargo" value={perfilRepresentante.cargo} onChange={handleChange} />
          <InputField label="Correo Electrónico" name="correo_representante" value={perfilRepresentante.correo_representante} onChange={handleChange} type="email" />
          <InputField label="Teléfono" name="telefono_representante" value={perfilRepresentante.telefono_representante} onChange={handleChange} />

          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="bg-[#07767c] text-white px-6 py-2.5 rounded-lg hover:bg-[#055a5f] transition font-semibold"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      ) : (
        <p>Cargando información del representante...</p>
      )}
    </div>
  );
}

// Helper component for input fields
const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
    />
  </div>
);

export default RepresentanteInfo;