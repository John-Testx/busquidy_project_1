import React, { useState } from "react";
import Modal from "../Modal";
import { Mail, Chrome, AlertCircle, Loader2 } from "lucide-react";
import { FaMicrosoft } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL

const RegisterModal = ({ onClose, onOpenSecondary, onOpenLogin, onOpenEmailVerification }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleContinueWithEmail = async () => {
        setError("");
        
        if (!email) {
            setError("El correo electrónico es obligatorio");
            return;
        }
        
        if (!validateEmail(email)) {
            setError("Por favor, ingresa un correo electrónico válido");
            return;
        }

        setLoading(true);
        
        try {
            // Llamar al endpoint para enviar código de verificación
            const response = await fetch(`${API_URL}/users/send-verification-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar código de verificación');
            }

            // Abrir modal de verificación de email
            onOpenEmailVerification(email);
            
        } catch (err) {
            setError(err.message || 'Error al enviar el código de verificación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true} size="lg">
            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Left Section - Hero */}
                <div className="flex-1 bg-gradient-to-br from-[#07767c] via-[#055a5f] to-[#043d42] text-white p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 hover:scale-110"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 transition-transform duration-700 hover:scale-110"></div>
                    
                    <div className="relative z-10 space-y-6 animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Comienza tu viaje con Busquidy
                        </h2>
                        <p className="text-white/90 mb-8 text-lg">
                            Únete a nuestra comunidad de profesionales y empresas
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Registro rápido y sencillo",
                                "Acceso a miles de proyectos",
                                "Conexión con talento verificado"
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
                <div className="flex-1 p-12 flex flex-col justify-center bg-gray-50">
                    <div className="max-w-md mx-auto w-full">
                        <div className="animate-[fadeIn_0.4s_ease-out]">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Crea tu cuenta
                            </h2>
                            <p className="text-gray-600 mb-8">
                                ¿Ya tienes una cuenta?{' '}
                                <button onClick={onOpenLogin} className="text-[#07767c] hover:text-[#055a5f] font-semibold transition-colors duration-200">
                                    Iniciar sesión
                                </button>
                            </p>
                        </div>

                        <div className="space-y-3">
                            {/* Google Button */}
                            <a 
                                href={`${API_URL}/users/auth/google`}
                                className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
                            >
                                <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform duration-200" />
                                <span>Continuar con Google</span>
                            </a>

                            {/* Microsoft Button */}
                            <a 
                                href={`${API_URL}/users/auth/microsoft`}
                                className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
                            >
                                <FaMicrosoft size={20} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                                <span>Continuar con Microsoft</span>
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gray-50 text-gray-500 font-medium">O</span>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200" />
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError("");
                                        }}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 outline-none ${
                                            error 
                                                ? 'border-red-500 focus:border-red-600' 
                                                : 'border-gray-200 focus:border-[#07767c] focus:shadow-md'
                                        }`}
                                        disabled={loading}
                                    />
                                    {error && (
                                        <AlertCircle size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-[fadeIn_0.2s_ease-out]" />
                                    )}
                                </div>
                                {error && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                                        <AlertCircle size={16} />
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Continue Button */}
                            <button 
                                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-[#055a5f] hover:to-[#043d42] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleContinueWithEmail}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Enviando código...</span>
                                    </>
                                ) : (
                                    <>
                                        <Mail size={20} className="group-hover:scale-110 transition-transform duration-200" />
                                        <span>Continuar con Correo Electrónico</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Terms */}
                        <p className="text-xs text-gray-500 text-center leading-relaxed animate-[fadeIn_0.6s_ease-out] mt-6">
                            Al registrarte, aceptas nuestros{' '}
                            <a href="#" className="text-[#07767c] hover:underline transition-all duration-200">
                                Términos de servicio
                            </a>
                            {' '}y{' '}
                            <a href="#" className="text-[#07767c] hover:underline transition-all duration-200">
                                Política de privacidad
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RegisterModal;