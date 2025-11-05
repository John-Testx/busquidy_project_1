import React, { useState } from "react";
import Modal from "../../Home/Modal";
import { ArrowLeft, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from 'react-router-dom'; 

const LoginSecondaryModal = ({ onClose, onBack, formData, setFormData, errors, handleLogin, loading, onOpenRegister }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true} size="lg">
            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Left Section - Hero */}
                <div className="flex-1 bg-gradient-to-br from-[#07767c] via-[#055a5f] to-[#043d42] text-white p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 hover:scale-110"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 transition-transform duration-700 hover:scale-110"></div>
                    
                    <div className="relative z-10 space-y-6 animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            ¡Bienvenido de nuevo!
                        </h2>
                        <p className="text-white/90 mb-8 text-lg">
                            Nos alegra verte otra vez por aquí
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Inicio de sesión seguro",
                                "Acceso rápido y fácil",
                                "Protección de tus datos"
                            ].map((item, index) => (
                                <li 
                                    key={index} 
                                    className="flex items-center gap-3 text-lg opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                                    style={{ animationDelay: `${index * 0.1}s` }}
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
                <div className="flex-1 p-12 flex flex-col justify-center bg-gray-50">
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
                                Iniciar sesión
                            </h3>
                            <p className="text-gray-600 mb-8">
                                Ingresa tus credenciales para continuar
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Email Input */}
                            <div className="animate-[fadeIn_0.5s_ease-out]">
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

                            {/* Password Input CON OJITO */}
                            <div className="animate-[fadeIn_0.6s_ease-out]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
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
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.contraseña && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                                        <AlertCircle size={16} />
                                        {errors.contraseña}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right animate-[fadeIn_0.7s_ease-out]">
                                <Link 
                                    to="/forgot-password"
                                    className="text-sm text-[#07767c] hover:text-[#055a5f] font-medium transition-colors duration-200 hover:underline"
                                    onClick={onClose}
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            
                            {/* Submit Button */}
                            <button 
                                className="w-full bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-[#055a5f] hover:to-[#043d42] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transform hover:-translate-y-0.5 animate-[fadeIn_0.8s_ease-out]"
                                onClick={handleLogin} 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Iniciando sesión...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Iniciar sesión</span>
                                        <ArrowLeft size={20} className="rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Register Link */}
                        <p className="text-center text-gray-600 mt-6 animate-[fadeIn_0.9s_ease-out]">
                            ¿No tienes una cuenta?{' '}
                            <button onClick={onOpenRegister} className="text-[#07767c] hover:text-[#055a5f] font-semibold transition-colors duration-200">
                                Regístrate
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LoginSecondaryModal;