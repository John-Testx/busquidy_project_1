import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { UserCircle, Mail, Phone, Briefcase } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';

function RepresentanteInfo() {
    const { perfilData, setPerfilData, handleUpdateProfile, loading } = useOutletContext();

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
    if (loading) return <LoadingScreen />;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#07767c] to-[#05595d] px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <UserCircle className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Representante Legal</h2>
                        <p className="text-white/80 text-sm">Persona de contacto principal</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                {perfilRepresentante ? (
                    <div className="space-y-8">
                        {/* Info del representante */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                                label="Nombre Completo" 
                                name="nombre_completo" 
                                value={perfilRepresentante.nombre_completo} 
                                onChange={handleChange}
                                icon={<UserCircle size={18} />}
                                className="md:col-span-2"
                            />
                            <InputField 
                                label="Cargo en la Empresa" 
                                name="cargo" 
                                value={perfilRepresentante.cargo} 
                                onChange={handleChange}
                                icon={<Briefcase size={18} />}
                            />
                            <InputField 
                                label="Teléfono de Contacto" 
                                name="telefono_representante" 
                                value={perfilRepresentante.telefono_representante} 
                                onChange={handleChange}
                                icon={<Phone size={18} />}
                                type="tel"
                            />
                            <InputField 
                                label="Correo Electrónico" 
                                name="correo_representante" 
                                value={perfilRepresentante.correo_representante} 
                                onChange={handleChange} 
                                type="email"
                                icon={<Mail size={18} />}
                                className="md:col-span-2"
                            />
                        </div>

                        {/* Info Box */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xl">ℹ️</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Información importante</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        El representante legal es la persona autorizada para actuar en nombre de la empresa. 
                                        Esta información será utilizada para comunicaciones oficiales y verificación de identidad.
                                    </p>
                                </div>
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

export default RepresentanteInfo;