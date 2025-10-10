import React from "react";
import Modal from "../Modal";

const SecondaryRegisterModal = ({ onClose, onBack, formData, setFormData, errors, handleRegister, loading, onOpenLogin }) => {
    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true}>
            <div className="flex justify-between w-full gap-5">
                {/* Left Section */}
                <div className="flex-1 bg-[#6e2243] text-white py-[60px] px-10 flex flex-col justify-center">
                    <h2 className="text-[2.4rem] mb-8 font-bold">
                        Únete a Busquidy
                    </h2>
                    <ul className="list-none p-0">
                        <li className="mb-5 text-xl flex items-center before:content-['✔'] before:mr-2.5 before:text-[1.4rem] before:text-white">
                            Registro fácil y rápido
                        </li>
                        <li className="mb-5 text-xl flex items-center before:content-['✔'] before:mr-2.5 before:text-[1.4rem] before:text-white">
                            Acceso seguro a nuestra plataforma
                        </li>
                        <li className="mb-5 text-xl flex items-center before:content-['✔'] before:mr-2.5 before:text-[1.4rem] before:text-white">
                            Tu privacidad es nuestra prioridad
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

                    <h3 className="text-3xl font-bold mb-8 text-gray-800">
                        Regístrate
                    </h3>

                    <div className="flex flex-col items-center gap-4">
                        {/* Tipo de Usuario */}
                        <div className="w-full max-w-[420px]">
                            <select
                                value={formData.tipoUsuario}
                                onChange={(e) => setFormData('tipoUsuario', e.target.value)}
                                className={`w-full p-3 text-base bg-white border ${errors.tipoUsuario ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                            >
                                <option value="">Selecciona tipo de usuario</option>
                                <option value="empresa">Empresa</option>
                                <option value="freelancer">Freelancer</option>
                            </select>
                            {errors.tipoUsuario && (
                                <p className="text-red-500 text-xs mt-2 text-left">
                                    {errors.tipoUsuario}
                                </p>
                            )}
                        </div>

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

                        {/* Botón Registrarse */}
                        <button 
                            className="w-full max-w-[420px] mt-4 py-3 px-5 text-base rounded-lg bg-[#272727] text-white font-semibold transition-all duration-300 hover:bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            onClick={handleRegister} 
                            disabled={loading}
                        >
                            {loading ? "Registrando..." : "Registrarse"}
                        </button>
                    </div>

                    <p className="text-base text-gray-600 mt-6">
                        ¿Ya tienes una cuenta?{' '}
                        <a href="#" onClick={onOpenLogin} className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                            Iniciar sesión
                        </a>
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default SecondaryRegisterModal;