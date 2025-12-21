import React, { useState } from "react";
import Modal from "../../Home/Modal";
import { ArrowLeft, Lock, AlertCircle, Loader2, User, Briefcase, Building2, Eye, EyeOff } from "lucide-react";

const SecondaryRegisterModal = ({ onClose, onBack, formData, setFormData, errors, handleRegister, loading, onOpenLogin, verifiedEmail }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 3 tipos de usuario
    const userTypes = [
        {
            value: "freelancer",
            label: "Estudiante",
            icon: User,
            description: "Busco proyectos",
            detail: "Estudiante o profesional independiente",
            color: "from-green-500 to-emerald-600"
        },
        {
            value: "empresa_juridico",
            label: "Cliente Jurídico",
            icon: Building2,
            description: "Busco contratar talento",
            detail: "Empresa con RUT jurídico",
            color: "from-blue-500 to-indigo-600"
        },
        {
            value: "empresa_natural",
            label: "Cliente Natural",
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
                <div className="flex-1 p-8 flex flex-col justify-center bg-gray-50 overflow-y-auto max-h-screen">
                    <div className="max-w-md mx-auto w-full">
                        {/* Back Button */}
                        <button 
                            type="button" 
                            className="flex items-center gap-2 text-gray-600 hover:text-[#07767c] transition-all duration-200 mb-4 group animate-[fadeIn_0.3s_ease-out]"
                            onClick={onBack}
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                            <span className="font-medium">Volver</span>
                        </button>

                        <div className="animate-[fadeIn_0.4s_ease-out]">
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                Crear cuenta
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm">
                                Registrándote con: <strong className="text-[#07767c]">{verifiedEmail}</strong>
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* User Type Selection - MÁS COMPACTO */}
                            <div className="animate-[fadeIn_0.5s_ease-out]">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ¿Qué tipo de cuenta necesitas?
                                </label>
                                <div className="space-y-2">
                                    {userTypes.map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = formData.tipoUsuario === type.value;
                                        
                                        return (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setFormData('tipoUsuario', type.value)}
                                                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left transform hover:-translate-y-0.5 ${
                                                    isSelected
                                                        ? 'border-[#07767c] bg-[#07767c]/5 shadow-md'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${type.color} transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>
                                                        <Icon size={20} className="text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-bold text-sm mb-0.5 transition-colors duration-200 ${
                                                            isSelected ? 'text-[#07767c]' : 'text-gray-800'
                                                        }`}>
                                                            {type.label}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {type.detail}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="w-5 h-5 bg-[#07767c] rounded-full flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                            {/* Password Input */}
                            <div className="animate-[fadeIn_0.6s_ease-out]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 6 caracteres"
                                        value={formData.contraseña}
                                        onChange={(e) => setFormData('contraseña', e.target.value)}
                                        className={`w-full pl-10 pr-10 py-3 bg-white border-2 rounded-xl transition-all duration-200 outline-none ${
                                            errors.contraseña 
                                                ? 'border-red-500 focus:border-red-600' 
                                                : 'border-gray-200 focus:border-[#07767c] focus:shadow-md'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.contraseña && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                                        <AlertCircle size={16} />
                                        {errors.contraseña}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Input - NUEVO */}
                            <div className="animate-[fadeIn_0.7s_ease-out]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Repetir Contraseña
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Repite tu contraseña"
                                        value={formData.confirmarContraseña}
                                        onChange={(e) => setFormData('confirmarContraseña', e.target.value)}
                                        className={`w-full pl-10 pr-10 py-3 bg-white border-2 rounded-xl transition-all duration-200 outline-none ${
                                            errors.confirmarContraseña 
                                                ? 'border-red-500 focus:border-red-600' 
                                                : 'border-gray-200 focus:border-[#07767c] focus:shadow-md'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmarContraseña && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                                        <AlertCircle size={16} />
                                        {errors.confirmarContraseña}
                                    </p>
                                )}
                            </div>

                            {/* Password strength indicator */}
                            {formData.contraseña && !errors.contraseña && (
                                <div className="animate-[fadeIn_0.3s_ease-out]">
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

                            {/* Terms and Conditions */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg animate-[fadeIn_0.8s_ease-out]">
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
                                className="w-full bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-[#055a5f] hover:to-[#043d42] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transform hover:-translate-y-0.5 animate-[fadeIn_0.9s_ease-out]"
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
                        <p className="text-center text-gray-600 mt-4 text-sm animate-[fadeIn_1s_ease-out]">
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