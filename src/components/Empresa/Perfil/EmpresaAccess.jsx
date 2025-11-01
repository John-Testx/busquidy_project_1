import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Shield, Mail, User, Lock, AlertCircle } from 'lucide-react';

function EmpresaAccess() {
    const { perfilData } = useOutletContext();
    const { perfilUsuario } = perfilData || {};

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#07767c] to-[#05595d] px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Shield className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Datos de Acceso</h2>
                        <p className="text-white/80 text-sm">Información de seguridad de tu cuenta</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                {perfilUsuario ? (
                    <div className="space-y-8">
                        {/* Account Info */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="text-[#07767c]" size={20} />
                                Información de la Cuenta
                            </h3>
                            <div className="space-y-4">
                                <ReadOnlyField 
                                    label="Correo Electrónico de Acceso" 
                                    value={perfilUsuario.correo}
                                    icon={<Mail size={18} />}
                                />
                                <ReadOnlyField 
                                    label="Tipo de Usuario" 
                                    value={perfilUsuario.tipo_usuario}
                                    icon={<User size={18} />}
                                    badge={true}
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                        {/* Security Info */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Lock className="text-[#07767c]" size={20} />
                                Seguridad
                            </h3>
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Cambio de Credenciales</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                            Para cambiar tu correo electrónico de acceso o contraseña, por favor dirígete a la sección de 
                                            <strong className="text-[#07767c]"> Configuración de Cuenta</strong>.
                                        </p>
                                        <button className="flex items-center gap-2 bg-white border-2 border-yellow-500 text-yellow-700 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-all duration-300">
                                            <Lock size={16} />
                                            Ir a Configuración
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Tips */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
<div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xl">💡</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Consejos de Seguridad</h4>
                                    <ul className="text-sm text-gray-700 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#07767c] mt-0.5">•</span>
                                            <span>Usa una contraseña única y segura para tu cuenta</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#07767c] mt-0.5">•</span>
                                            <span>No compartas tus credenciales de acceso con nadie</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#07767c] mt-0.5">•</span>
                                            <span>Cierra sesión cuando uses dispositivos compartidos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#07767c] mt-0.5">•</span>
                                            <span>Mantén tu información de contacto actualizada</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
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

const ReadOnlyField = ({ label, value, icon, badge = false }) => (
    <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">{label}</label>
        <div className="relative">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </div>
            )}
            <div className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center ${badge ? 'justify-between' : ''}`}>
                <span className="text-gray-700 font-medium">
                    {value || 'No disponible'}
                </span>
                {badge && value && (
                    <span className="bg-gradient-to-r from-[#07767c] to-[#05595d] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {
                            /* AQUÍ ESTÁ EL CAMBIO */
                            (value === 'empresa' || value === 'empresa_juridico' || value === 'empresa_natural')
                              ? 'EMPRESA' 
                              : value.toUpperCase()
                        }
                    </span>
                )}
            </div>
        </div>
    </div>
);

export default EmpresaAccess;