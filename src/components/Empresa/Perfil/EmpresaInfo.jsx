import React from 'react';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';
import { Building2, Mail, Phone, Globe, MapPin, Briefcase, FileText } from 'lucide-react';

function EmpresaInfo() {
  const { perfilData, setPerfilData, handleUpdateProfile } = useOutletContext();

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#07767c] to-[#05595d] px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Building2 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Información de la Empresa</h2>
            <p className="text-white/80 text-sm">Datos corporativos y de contacto</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {perfilEmpresa ? (
          <div className="space-y-8">
            {/* Datos básicos */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="text-[#07767c]" size={20} />
                Datos Básicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                  label="Nombre de la Empresa" 
                  name="nombre_empresa" 
                  value={perfilEmpresa.nombre_empresa} 
                  onChange={handleChange}
                  icon={<Building2 size={18} />}
                />
                <InputField 
                  label="RUT / Identificación Fiscal" 
                  name="identificacion_fiscal" 
                  value={perfilEmpresa.identificacion_fiscal} 
                  onChange={handleChange}
                  icon={<FileText size={18} />}
                />
                <InputField 
                  label="Sector / Industria" 
                  name="sector_industrial" 
                  value={perfilEmpresa.sector_industrial} 
                  onChange={handleChange}
                  icon={<Briefcase size={18} />}
                />
                <InputField 
                  label="Dirección" 
                  name="direccion" 
                  value={perfilEmpresa.direccion} 
                  onChange={handleChange}
                  icon={<MapPin size={18} />}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

            {/* Contacto */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="text-[#07767c]" size={20} />
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                  label="Teléfono de Contacto" 
                  name="telefono_contacto" 
                  value={perfilEmpresa.telefono_contacto} 
                  onChange={handleChange}
                  icon={<Phone size={18} />}
                  type="tel"
                />
                <InputField 
                  label="Correo Electrónico" 
                  name="correo_empresa" 
                  value={perfilEmpresa.correo_empresa} 
                  onChange={handleChange} 
                  type="email"
                  icon={<Mail size={18} />}
                />
                <InputField 
                  label="Página Web" 
                  name="pagina_web" 
                  value={perfilEmpresa.pagina_web} 
                  onChange={handleChange} 
                  type="url"
                  icon={<Globe size={18} />}
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="text-[#07767c]" size={20} />
                Descripción de la Empresa
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Cuéntanos sobre tu empresa
                </label>
                <textarea
                  name="descripcion"
                  value={perfilEmpresa.descripcion}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe tu empresa, misión, visión y valores..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-all duration-200 outline-none resize-none hover:border-gray-300"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Esta descripción será visible para los freelancers
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar Cambios
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#07767c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Cargando información...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const InputField = ({ label, name, value, onChange, type = "text", icon, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-bold text-gray-800 mb-3">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-all duration-200 outline-none hover:border-gray-300`}
      />
    </div>
  </div>
);

export default EmpresaInfo;