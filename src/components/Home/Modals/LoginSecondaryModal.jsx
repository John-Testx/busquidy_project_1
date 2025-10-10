import React from "react";
import Modal from "../Modal";

const LoginSecondaryModal = ({ onClose, onBack, formData, setFormData, errors, handleLogin, loading, onOpenRegister }) => {
    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true}>
            <div className="flex justify-between w-full gap-5">
                {/* Left Section */}
                <div className="flex-1 bg-[#6e2243] text-white py-[60px] px-10 flex flex-col justify-center">
                    <h2 className="text-[2.4rem] mb-8 font-bold">
                        Bienvenido de nuevo
                    </h2>
                    <ul className="list-none p-0">
                        <li className="mb-5 text-xl flex items-center before:content-['✔'] before:mr-2.5 before:text-[1.4rem] before:text-white">
                            Inicio de sesión seguro
                        </li>
                        <li className="mb-5 text-xl flex items-center before:content-['✔'] before:mr-2.5 before:text-[1.4rem] before:text-white">
                            Acceso fácil y rápido
                        </li>
                        <li className="mb-5 text-xl flex items-center before:content-['✔'] before:mr-2.5 before:text-[1.4rem] before:text-white">
                            Protegeremos tus datos
                        </li>
                    </ul>
                </div>

                {/* Right Section */}
                <div className="flex-1 flex flex-col justify-center py-10 px-8 text-center relative">
                    <button 
                        type="button" 
                        className="mb-5 py-2 px-2.5 text-base border-none bg-transparent text-black cursor-pointer hover:underline w-[150px] text-left"
                        onClick={onBack}
                    >
                        ← volver
                    </button>

                    <h3 className="text-3xl font-bold mb-8 text-gray-800">Iniciar sesión</h3>

                    <div className="flex flex-col items-center gap-4">
                        {/* Correo */}
                        <div className="w-full max-w-[420px]">
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                value={formData.correo}
                                onChange={(e) => setFormData('correo', e.target.value)}
                                className={`w-full p-3 text-base border ${errors.correo ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                            />
                            {errors.correo && (
                                <p className="text-red-500 text-xs mt-2 text-left">
                                    {errors.correo}
                                </p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="w-full max-w-[420px]">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={formData.contraseña}
                                onChange={(e) => setFormData('contraseña', e.target.value)}
                                className={`w-full p-3 text-base border ${errors.contraseña ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                            />
                            {errors.contraseña && (
                                <p className="text-red-500 text-xs mt-2 text-left">
                                    {errors.contraseña}
                                </p>
                            )}
                        </div>

                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors self-end max-w-[420px] w-full text-right">
                            ¿Olvidaste tu contraseña?
                        </a>

                        {/* Botón Iniciar sesión */}
                        <button 
                            className="w-full max-w-[420px] mt-4 py-3 px-5 text-base rounded-lg bg-[#272727] text-white font-semibold transition-all duration-300 hover:bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            onClick={handleLogin} 
                            disabled={loading}
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                    </div>

                    <p className="text-base text-gray-600 mt-6">
                        ¿No tienes una cuenta?{' '}
                        <a href="#" onClick={onOpenRegister} className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                            Regístrate
                        </a>
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default LoginSecondaryModal;