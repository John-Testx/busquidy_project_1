import React from "react";
import Modal from "../../Home/Modal";
import { Mail, Chrome } from "lucide-react";
import { FaMicrosoft } from "react-icons/fa";
import AuthHero from "../AuthHero";

const API_URL = import.meta.env.VITE_API_URL

const LoginModal = ({ onClose, onOpenSecondary, onOpenRegister }) => {
    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true} size="lg">
            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Left Section - Hero */}
                <AuthHero />

                {/* Right Section - Form */}
                <div className="flex-1 p-12 flex flex-col justify-center bg-gray-50">
                    <div className="max-w-md mx-auto w-full space-y-6">
                        <div className="animate-[fadeIn_0.4s_ease-out]">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Inicia sesión
                            </h2>
                            <p className="text-gray-600 mb-8">
                                ¿No tienes una cuenta?{' '}
                                <button 
                                    onClick={onOpenRegister} 
                                    className="text-[#07767c] hover:text-[#055a5f] font-semibold transition-colors duration-200"
                                >
                                    Regístrate aquí
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

                        {/* Email Button - ABAJO */}
                        <button 
                            className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-[#07767c] hover:bg-[#07767c]/5 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
                            onClick={onOpenSecondary}
                        >
                            <Mail size={20} className="text-[#07767c] group-hover:scale-110 transition-transform duration-200" />
                            <span>Continuar con Correo Electrónico</span>
                        </button>

                        {/* Terms */}
                        <p className="text-xs text-gray-500 text-center leading-relaxed animate-[fadeIn_0.6s_ease-out] mt-6">
                            Al unirte, aceptas nuestros{' '}
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

export default LoginModal;