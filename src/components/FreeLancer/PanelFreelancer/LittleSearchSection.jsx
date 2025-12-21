import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';

function LittleSearchSection() {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        cargo: '',
        ubicacion: ''
    });

    const handleSearch = () => {
        navigate('/projectlist', { 
            state: { 
                cargo: searchData.cargo, 
                ubicacion: searchData.ubicacion 
            } 
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Categorías populares para quick access
    const popularCategories = [
        "Desarrollo Web",
        "Diseño Gráfico",
        "Marketing Digital",
        "Redacción",
        "Traducción"
    ];

    return (
        <div className="relative bg-gradient-to-br from-[#07767c] via-[#05696e] to-[#05595d] py-20 px-4 sm:py-24 lg:py-28 overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Círculos decorativos */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-[#40E0D0]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#40E0D0]/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
                
                {/* Pattern overlay */}
                {/* <div className="absolute inset-0 bg- opacity-5"></div> */}
            </div>
           
            <div className="relative max-w-7xl mx-auto">
                {/* Badges superiores */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <TrendingUp size={16} className="text-[#40E0D0]" />
                        <span className="text-white text-sm font-medium">+5,000 proyectos activos</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <Sparkles size={16} className="text-[#40E0D0]" />
                        <span className="text-white text-sm font-medium">Nuevas ofertas cada día</span>
                    </div>
                </div>

                {/* Títulos */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        ¡Busca{' '}
                        <span className="relative inline-block">
                            <span className="text-[#40E0D0]">publicaciones</span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                                <path d="M0 4C50 1 150 1 200 4" stroke="#40E0D0" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                        </span>
                        {' '}de tu interés!
                    </h1>
                    <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
                        Encuentra el proyecto que mejor encaje con tus habilidades y experiencia
                    </p>
                </div>

                {/* Barra de búsqueda mejorada */}
                <div className="max-w-5xl mx-auto mb-8">
                    <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4">
                        <div className="flex flex-col lg:flex-row items-stretch gap-3">
                            {/* Input Cargo */}
                            <div className="relative flex-1 group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                    <Briefcase 
                                        size={20} 
                                        className="text-[#07767c] group-focus-within:text-[#05595d] transition-colors" 
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="¿Qué tipo de trabajo buscas?"
                                    value={searchData.cargo}
                                    onChange={(e) => setSearchData({ ...searchData, cargo: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-transparent text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#07767c] transition-all duration-300 bg-gray-50 focus:bg-white"
                                />
                            </div>

                            {/* Separador vertical (solo desktop) */}
                            <div className="hidden lg:block w-px bg-gray-200"></div>

                            {/* Input Ubicación */}
                            <div className="relative flex-1 group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                    <MapPin 
                                        size={20} 
                                        className="text-[#07767c] group-focus-within:text-[#05595d] transition-colors" 
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ciudad o país"
                                    value={searchData.ubicacion}
                                    onChange={(e) => setSearchData({ ...searchData, ubicacion: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-transparent text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#07767c] transition-all duration-300 bg-gray-50 focus:bg-white"
                                />
                            </div>

                            {/* Botón de búsqueda */}
                            <button
                                onClick={handleSearch}
                                className="group px-8 py-4 bg-gradient-to-r from-[#07767c] to-[#05595d] hover:from-[#05595d] hover:to-[#043d42] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0"
                            >
                                <Search size={20} className="group-hover:scale-110 transition-transform" />
                                <span>Buscar Proyectos</span>
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Sugerencias rápidas */}
                    <div className="mt-6 text-center">
                        <p className="text-white/80 text-sm mb-3 font-medium">Categorías populares:</p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {popularCategories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSearchData({ ...searchData, cargo: category });
                                        // Opcional: buscar automáticamente
                                        // handleSearch();
                                    }}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <p className="text-3xl font-bold text-white mb-1">10K+</p>
                        <p className="text-white/80 text-sm">Proyectos</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <p className="text-3xl font-bold text-white mb-1">5K+</p>
                        <p className="text-white/80 text-sm">Clientes</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <p className="text-3xl font-bold text-white mb-1">15K+</p>
                        <p className="text-white/80 text-sm">Estudiantes</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <p className="text-3xl font-bold text-white mb-1">98%</p>
                        <p className="text-white/80 text-sm">Satisfacción</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LittleSearchSection;