import React from "react";
import Modal from "../Modal";

const RegisterModal = ({ onClose, onOpenSecondary, onOpenLogin }) => {
    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true}>
            <div className="flex justify-between w-full gap-5">
                {/* Left Section */}
                <div className="flex-1 bg-[#6e2243] text-white py-[60px] px-10 flex flex-col justify-center">
                    <h2 className="text-[2.4rem] mb-8 font-bold">
                        El camino al éxito comienza contigo aquí
                    </h2>
                    <ul className="list-none p-0">
                        <li className="mb-5 text-xl flex items-center before:content-['✔'] before:mr-2.5 before:text-[1.4rem] before:text-white">
                            Diversas categorías para buscar
                        </li>
                        <li className="mb-5 text-xl flex items-center before:content-['✔'] before:mr-2.5 before:text-[1.4rem] before:text-white">
                            Trabajo de calidad en tus proyectos
                        </li>
                        <li className="mb-5 text-xl flex items-center before:content-['✔'] before:mr-2.5 before:text-[1.4rem] before:text-white">
                            Acceso a joven talento profesional
                        </li>
                    </ul>
                </div>

                {/* Right Section */}
                <div className="flex-1 flex flex-col justify-center py-10 px-8 text-center relative">
                    <h2 className="text-3xl my-5 mb-0 font-bold text-center">
                        Crea tu cuenta
                    </h2>
                    <p className="text-base text-gray-600 mb-5 text-left">
                        ¿Ya tienes una cuenta?{' '}
                        <a href="#" onClick={onOpenLogin} className="text-blue-600 hover:text-blue-800 transition-colors">
                            Iniciar sesión
                        </a>
                    </p>

                    <button 
                        className="flex items-center justify-start my-1.5 py-2.5 px-5 text-base border border-gray-300 rounded-md bg-white text-gray-800 transition-all duration-300 hover:bg-gray-100 cursor-pointer w-[400px] ml-5"
                        onClick={onOpenSecondary}
                    >
                        <img src="/images/email.svg" alt="Email" className="h-5 mr-2.5" />
                        Continuar con Correo Electrónico
                    </button>

                    <button className="flex items-center justify-start my-1.5 py-2.5 px-5 text-base border border-gray-300 rounded-md bg-white text-gray-800 transition-all duration-300 hover:bg-gray-100 cursor-pointer w-[400px] ml-5">
                        <img src="/images/google.svg.svg" alt="Google" className="h-5 mr-2.5" />
                        Continuar con Google
                    </button>

                    <button className="flex items-center justify-start my-1.5 py-2.5 px-5 text-base border border-gray-300 rounded-md bg-white text-gray-800 transition-all duration-300 hover:bg-gray-100 cursor-pointer w-[400px] ml-5">
                        <img src="/images/microsoft.svg" alt="Microsoft" className="h-5 mr-2.5" />
                        Continuar con Microsoft
                    </button>

                    <button className="flex items-center justify-start my-1.5 py-2.5 px-5 text-base border border-gray-300 rounded-md bg-white text-gray-800 transition-all duration-300 hover:bg-gray-100 cursor-pointer w-[400px] ml-5">
                        <img src="/images/apple.svg" alt="Apple" className="h-5 mr-2.5" />
                        Continuar con Apple
                    </button>

                    {/* Divider */}
                    <div className="flex justify-center items-center my-5 mr-8">
                        <div className="w-full flex items-center justify-center text-center relative before:content-[''] before:flex-1 before:border-b before:border-gray-300 before:mx-2.5 after:content-[''] after:flex-1 after:border-b after:border-gray-300 after:mx-2.5">
                            <span className="px-2.5 text-base text-gray-600">O</span>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="mt-5 text-xs text-gray-500 text-left">
                        <p className="m-0 leading-relaxed">
                            Al unirte, aceptas los{' '}
                            <a href="#" className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                                Términos de servicio
                            </a>
                            {' '}y nuestra{' '}
                            <a href="#" className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                                Política de privacidad
                            </a>.
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RegisterModal;