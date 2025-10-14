import React from "react";
import Modal from "../Modal";
import { Mail, Chrome, } from "lucide-react";
import { FaMicrosoft, FaApple } from "react-icons/fa";

const LoginModal = ({ onClose, onOpenSecondary, onOpenRegister }) => {
    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true} size="lg">
            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Left Section - Hero */}
                <div className="flex-1 bg-gradient-to-br from-[#07767c] via-[#055a5f] to-[#043d42] text-white p-12 flex flex-col justify-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            El camino al éxito comienza aquí
                        </h2>
                        <p className="text-white/90 mb-8 text-lg">
                            Únete a miles de profesionales y empresas que ya confían en Busquidy
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Diversas categorías para buscar",
                                "Trabajo de calidad en tus proyectos",
                                "Acceso a joven talento profesional"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-lg">
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
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
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Inicia sesión
                        </h2>
                        <p className="text-gray-600 mb-8">
                            ¿No tienes una cuenta?{' '}
                            <button onClick={onOpenRegister} className="text-[#07767c] hover:text-[#055a5f] font-semibold transition-colors">
                                Regístrate aquí
                            </button>
                        </p>

                        <div className="space-y-3">
                            {/* Email Button */}
                            <button 
                                className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-[#07767c] hover:bg-[#07767c]/5 transition-all duration-200 shadow-sm hover:shadow-md group"
                                onClick={onOpenSecondary}
                            >
                                <Mail size={20} className="text-[#07767c] group-hover:scale-110 transition-transform" />
                                <span>Continuar con Correo Electrónico</span>
                            </button>

                            {/* Google Button */}
                            <button className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group">
                                <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                                <span>Continuar con Google</span>
                            </button>

                            {/* Microsoft Button */}
                            <button className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group">
                                <FaMicrosoft size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                <span>Continuar con Microsoft</span>
                            </button>

                            {/* Apple Button */}
                            <button className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group">
                                <FaApple size={20} className="text-gray-800 group-hover:scale-110 transition-transform" />
                                <span>Continuar con Apple</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gray-50 text-gray-500 font-medium">O</span>
                            </div>
                        </div>

                        {/* Terms */}
                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                            Al unirte, aceptas nuestros{' '}
                            <a href="#" className="text-[#07767c] hover:underline">
                                Términos de servicio
                            </a>
                            {' '}y{' '}
                            <a href="#" className="text-[#07767c] hover:underline">
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