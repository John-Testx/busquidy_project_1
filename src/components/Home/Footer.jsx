import React, { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

function Footer() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleColumn = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <footer className="bg-gray-50 py-10 px-5 border-t border-gray-200 w-full mt-auto">
            <div className="flex flex-wrap justify-between mb-5 px-0 md:px-12 lg:px-14">
                {/* Primera columna - Categorías */}
                <div className={`flex-1 min-w-[200px] mx-0 md:mx-5 mb-6 md:mb-0 ${activeIndex === 0 ? "active" : ""}`}>
                    <h3 
                        onClick={() => toggleColumn(0)}
                        className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center mr-5 cursor-pointer md:cursor-default relative after:content-[''] after:block after:w-1/2 after:h-0.5 after:bg-teal-700 after:absolute after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full md:after:hidden"
                    >
                        Categorías
                        <i className={`bi bi-chevron-down ml-2 transition-transform duration-300 ${activeIndex === 0 ? "rotate-180" : "rotate-0"} opacity-0 md:opacity-0`}></i>
                    </h3>
                    <ul className={`list-none p-0 overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === 0 ? "max-h-[500px]" : "max-h-0 md:max-h-none"}`}>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 0 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Programación y tecnología
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 0 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Marketing digital
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 0 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Diseño Gráfico
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 0 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Asistencia Virtual
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 0 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Animación y 3D
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 0 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Edición de Video
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 0 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Ver más+
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Segunda columna - Acerca de nosotros */}
                <div className={`flex-1 min-w-[200px] mx-0 md:mx-5 mb-6 md:mb-0 ${activeIndex === 1 ? "active" : ""}`}>
                    <h3 
                        onClick={() => toggleColumn(1)}
                        className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center mr-5 cursor-pointer md:cursor-default relative after:content-[''] after:block after:w-1/2 after:h-0.5 after:bg-teal-700 after:absolute after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full md:after:hidden"
                    >
                        Acerca de nosotros
                        <i className={`bi bi-chevron-down ml-2 transition-transform duration-300 ${activeIndex === 1 ? "rotate-180" : "rotate-0"} opacity-0 md:opacity-0`}></i>
                    </h3>
                    <ul className={`list-none p-0 overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === 1 ? "max-h-[500px]" : "max-h-0 md:max-h-none"}`}>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 1 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Sobre nosotros
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 1 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Únete a Busquidy
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 1 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Políticas de Busquidy
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 1 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Términos de servicio
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 1 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Política de privacidad
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Tercera columna - Soporte */}
                <div className={`flex-1 min-w-[200px] mx-0 md:mx-5 mb-6 md:mb-0 ${activeIndex === 2 ? "active" : ""}`}>
                    <h3 
                        onClick={() => toggleColumn(2)}
                        className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center mr-5 cursor-pointer md:cursor-default relative after:content-[''] after:block after:w-1/2 after:h-0.5 after:bg-teal-700 after:absolute after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full md:after:hidden"
                    >
                        Soporte
                        <i className={`bi bi-chevron-down ml-2 transition-transform duration-300 ${activeIndex === 2 ? "rotate-180" : "rotate-0"} opacity-0 md:opacity-0`}></i>
                    </h3>
                    <ul className={`list-none p-0 overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === 2 ? "max-h-[500px]" : "max-h-0 md:max-h-none"}`}>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 2 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Soporte al cliente
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 2 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Soporte IA
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 2 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Busquidy guía
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Cuarta columna - Plataforma */}
                <div className={`flex-1 min-w-[200px] mx-0 md:mx-5 mb-6 md:mb-0 ${activeIndex === 3 ? "active" : ""}`}>
                    <h3 
                        onClick={() => toggleColumn(3)}
                        className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center mr-5 cursor-pointer md:cursor-default relative after:content-[''] after:block after:w-1/2 after:h-0.5 after:bg-teal-700 after:absolute after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full md:after:hidden"
                    >
                        Plataforma
                        <i className={`bi bi-chevron-down ml-2 transition-transform duration-300 ${activeIndex === 3 ? "rotate-180" : "rotate-0"} opacity-0 md:opacity-0`}></i>
                    </h3>
                    <ul className={`list-none p-0 overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === 3 ? "max-h-[500px]" : "max-h-0 md:max-h-none"}`}>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 3 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Comunidad
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 3 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Busquidy Pro
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 3 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Certificado Busquidy
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 3 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                FreeLancer
                            </a>
                        </li>
                        <li className={`my-2 transition-opacity duration-300 ${activeIndex === 3 ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
                            <a href="#" className="no-underline text-gray-800 hover:text-teal-700 transition-colors duration-300">
                                Empresa
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Quinta columna - Redes Sociales */}
                <div className="flex-1 min-w-[200px] mx-0 md:mx-5 text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Síguenos</h3>
                    <div className="flex justify-center my-5 gap-3">
                        <a href="#" className="text-gray-800 text-2xl transition-colors duration-300 hover:text-teal-700">
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a href="#" className="text-gray-800 text-2xl transition-colors duration-300 hover:text-teal-700">
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a href="#" className="text-gray-800 text-2xl transition-colors duration-300 hover:text-teal-700">
                            <i className="bi bi-tiktok"></i>
                        </a>
                        <a href="#" className="text-gray-800 text-2xl transition-colors duration-300 hover:text-teal-700">
                            <i className="bi bi-twitter-x"></i>
                        </a>
                    </div>
                    <div className="flex justify-center gap-4 mt-5">
                        <button className="bg-transparent border-none inline-block p-0 cursor-pointer">
                            <img 
                                src="/images/googlePlay.svg" 
                                alt="Google Play" 
                                className="w-32 h-auto transition-transform duration-300 hover:scale-110"
                            />
                        </button>
                        <button className="bg-transparent border-none inline-block p-0 cursor-pointer">
                            <img 
                                src="/images/appleStore.svg" 
                                alt="App Store" 
                                className="w-32 h-auto transition-transform duration-300 hover:scale-110"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sección de copyright */}
            <div className="text-center py-5 border-t-2 border-gray-200">
                <p className="m-0 text-sm text-gray-600">
                    Copyright © 2025 Busquidy. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default Footer;