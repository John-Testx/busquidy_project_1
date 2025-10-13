import React from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function LittleSearchSection() {
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/projectlist');
    };

    return (
        <div className="relative bg-gradient-to-br from-[#07767c] to-[#05595d] py-24 px-4 sm:py-28 lg:py-32">
            {/* Overlay decorativo sutil */}
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
            
            <div className="relative max-w-6xl mx-auto text-center">
                {/* Títulos */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white mb-4 leading-tight">
                    ¡Busca <span className="text-[#40E0D0] font-serif italic">publicaciones</span> de tu interés!
                </h1>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white/95 mb-12 leading-tight">
                    Encuentra el <span className="text-[#40E0D0] font-serif italic">proyecto</span> que mejor encaje contigo
                </h2>

                {/* Barra de búsqueda */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-4xl mx-auto">
                    {/* Input Cargo */}
                    <div className="relative w-full sm:w-64 group">
                        <i className="bi bi-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-[#07767c] text-xl transition-transform duration-300 group-hover:-translate-x-1"></i>
                        <input 
                            type="text" 
                            placeholder="Cargo o Categoría" 
                            className="w-full pl-11 pr-4 py-3 rounded-lg border-none text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#40E0D0] transition-all duration-300"
                        />
                    </div>

                    {/* Input Ubicación */}
                    <div className="relative w-full sm:w-64 group">
                        <i className="bi bi-geo-alt absolute left-3 top-1/2 -translate-y-1/2 text-[#07767c] text-xl transition-transform duration-300 group-hover:-translate-x-1"></i>
                        <input 
                            type="text" 
                            placeholder="Ubicación" 
                            className="w-full pl-11 pr-4 py-3 rounded-lg border-none text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#40E0D0] transition-all duration-300"
                        />
                    </div>

                    {/* Botón de búsqueda */}
                    <button 
                        onClick={handleSearch}
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#F08080] to-[#E85757] hover:from-[#E85757] hover:to-[#D04848] text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <i className="bi bi-search"></i>
                        <span>Buscar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LittleSearchSection;