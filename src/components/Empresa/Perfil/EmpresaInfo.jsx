import React from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
// import { useProfileData } from '../../../pages/Empresa/EmpresaProfileLayout'; // Adjust path if needed
import { Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from "@/hooks";

function EmpresaInfo() {
  // Use the context from the layout to get data and the setter
  const { perfilData, setPerfilData, handleUpdateProfile} = useOutletContext();
    const {id_usuario, userType} = useAuth();
  // Handle changes only for this section's data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfilData(prev => ({
      ...prev,
      perfilEmpresa: { ...prev.perfilEmpresa, [name]: value }
    }));
  };

  const handleSave = async () => {
    handleUpdateProfile();
  };

  const { perfilEmpresa } = perfilData || {};

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de la Empresa</h2>
      
      {perfilEmpresa ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Nombre de la Empresa" name="nombre_empresa" value={perfilEmpresa.nombre_empresa} onChange={handleChange} />
          <InputField label="RUT" name="identificacion_fiscal" value={perfilEmpresa.identificacion_fiscal} onChange={handleChange} />
          <InputField label="Dirección" name="direccion" value={perfilEmpresa.direccion} onChange={handleChange} />
          <InputField label="Teléfono" name="telefono_contacto" value={perfilEmpresa.telefono_contacto} onChange={handleChange} />
          <InputField label="Correo Electrónico" name="correo_empresa" value={perfilEmpresa.correo_empresa} onChange={handleChange} type="email" />
          <InputField label="Página Web" name="pagina_web" value={perfilEmpresa.pagina_web} onChange={handleChange} type="url" />
          <InputField label="Sector/Industria" name="sector_industrial" value={perfilEmpresa.sector_industrial} onChange={handleChange} />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={perfilEmpresa.descripcion}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-[#07767c] text-white px-6 py-2.5 rounded-lg hover:bg-[#055a5f] transition font-semibold"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      ) : (
        <p>Cargando información de la empresa...</p>
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

export default EmpresaInfo;