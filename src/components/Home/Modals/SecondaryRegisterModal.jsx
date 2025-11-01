import React, { useState } from "react";
import Modal from "../Modal";
import { ArrowLeft, Mail, Lock, AlertCircle, Loader2, User, Briefcase, Building2 } from "lucide-react";

const SecondaryRegisterModal = ({ onClose, onBack, formData, setFormData, errors, handleRegister, loading, onOpenLogin }) => {
    const [showPassword, setShowPassword] = useState(false);

    // ✅ ACTUALIZADO: 3 tipos de usuario
    const userTypes = [
        {
            value: "freelancer",
            label: "Freelancer",
            icon: User,
            description: "Busco proyectos",
            detail: "Estudiante o profesional independiente",
            color: "from-green-500 to-emerald-600"
        },
        {
            value: "empresa_juridico",
            label: "Empresa Jurídica",
            icon: Building2,
            description: "Busco contratar talento",
            detail: "Empresa con RUT jurídico",
            color: "from-blue-500 to-indigo-600"
        },
        {
            value: "empresa_natural",
            label: "Empresa Natural",
            icon: Briefcase,
            description: "Busco contratar talento",
            detail: "Emprendedor con RUT natural",
            color: "from-purple-500 to-pink-600"
        }
    ];

    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true} size="lg">
            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Left Section - Hero */}
                <div className="flex-1 bg-gradient-to-br from-[#07767c] via-[#055a5f] to-[#043d42] text-white p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 hover:scale-110"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 transition-transform duration-700 hover:scale-110"></div>
                    
                    <div className="relative z-10 space-y-6 animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Únete a Busquidy
                        </h2>
                        <p className="text-white/90 mb-8 text-lg">
                            Comienza tu viaje hacia el éxito profesional
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Registro rápido y seguro",
                                "Acceso a miles de oportunidades",
                                "Protección de tus datos garantizada"
                            ].map((item, index) => (
                                <li 
                                    key={index} 
                                    className="flex items-center gap-3 text-lg opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                                    style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                                >
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="flex-1 p-12 flex flex-col justify-center bg-gray-50 overflow-y-auto max-h-screen">
                    <div className="max-w-md mx-auto w-full">
                        {/* Back Button */}
                        <button 
                            type="button" 
                            className="flex items-center gap-2 text-gray-600 hover:text-[#07767c] transition-all duration-200 mb-6 group animate-[fadeIn_0.3s_ease-out]"
                            onClick={onBack}
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                            <span className="font-medium">Volver</span>
                        </button>

                        <div className="animate-[fadeIn_0.4s_ease-out]">
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">
                                Crear cuenta
                            </h3>
                            <p className="text-gray-600 mb-8">
                                Completa los siguientes datos para registrarte
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* User Type Selection - ACTUALIZADO A 3 OPCIONES */}
                            <div className="animate-[fadeIn_0.5s_ease-out]">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    ¿Qué tipo de cuenta necesitas?
                                </label>
                                <div className="space-y-3">
                                    {userTypes.map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = formData.tipoUsuario === type.value;
                                        
                                        return (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setFormData('tipoUsuario', type.value)}
                                                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left transform hover:-translate-y-0.5 ${
                                                    isSelected
                                                        ? 'border-[#07767c] bg-[#07767c]/5 shadow-md'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${type.color} transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>
                                                        <Icon size={24} className="text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-bold text-base mb-1 transition-colors duration-200 ${
                                                            isSelected ? 'text-[#07767c]' : 'text-gray-800'
                                                        }`}>
                                                            {type.label}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mb-0.5">
                                                            {type.description}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {type.detail}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="w-6 h-6 bg-[#07767c] rounded-full flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.tipoUsuario && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                                        <AlertCircle size={16} />
                                        {errors.tipoUsuario}
                                    </p>
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="animate-[fadeIn_0.6s_ease-out]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200" />
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={formData.correo}
                                        onChange={(e) => setFormData('correo', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 outline-none ${
                                            errors.correo 
                                                ? 'border-red-500 focus:border-red-600' 
                                                : 'border-gray-200 focus:border-[#07767c] focus:shadow-md'
                                        }`}
                                    />
                                    {errors.correo && (
                                        <AlertCircle size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-[fadeIn_0.2s_ease-out]" />
                                    )}
                                </div>
                                {errors.correo && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                                        <AlertCircle size={16} />
                                        {errors.correo}
                                    </p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="animate-[fadeIn_0.7s_ease-out]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 6 caracteres"
                                        value={formData.contraseña}
                                        onChange={(e) => setFormData('contraseña', e.target.value)}
                                        className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 outline-none ${
                                            errors.contraseña 
                                                ? 'border-red-500 focus:border-red-600' 
                                                : 'border-gray-200 focus:border-[#07767c] focus:shadow-md'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.contraseña && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                                        <AlertCircle size={16} />
                                        {errors.contraseña}
                                    </p>
                                )}
                                {/* Password strength indicator */}
                                {formData.contraseña && !errors.contraseña && (
                                    <div className="mt-2 animate-[fadeIn_0.3s_ease-out]">
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                        formData.contraseña.length >= level * 2
                                                            ? formData.contraseña.length >= 6
                                                                ? 'bg-green-500'
                                                                : 'bg-yellow-500'
                                                            : 'bg-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.contraseña.length < 6
                                                ? `Faltan ${6 - formData.contraseña.length} caracteres`
                                                : '¡Contraseña segura!'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg animate-[fadeIn_0.8s_ease-out]">
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Al registrarte, aceptas nuestros{' '}
                                    <a href="#" className="text-[#07767c] hover:underline font-medium transition-colors duration-200">
                                        Términos de servicio
                                    </a>
                                    {' '}y{' '}
                                    <a href="#" className="text-[#07767c] hover:underline font-medium transition-colors duration-200">
                                        Política de privacidad
                                    </a>
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button 
                                className="w-full bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-[#055a5f] hover:to-[#043d42] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transform hover:-translate-y-0.5 animate-[fadeIn_0.9s_ease-out]"
                                onClick={handleRegister} 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Creando cuenta...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Crear mi cuenta</span>
                                        <ArrowLeft size={20} className="rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-gray-600 mt-6 animate-[fadeIn_1s_ease-out]">
                            ¿Ya tienes una cuenta?{' '}
                            <button onClick={onOpenLogin} className="text-[#07767c] hover:text-[#055a5f] font-semibold transition-colors duration-200">
                                Iniciar sesión
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SecondaryRegisterModal;