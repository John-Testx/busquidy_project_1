import React from "react";
import { Link } from "react-router-dom";

function EmpresaActionsCard() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Container with gradient background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#07373f] via-[#0a474f] to-[#07767c] shadow-2xl border border-[#0a6978]/50 p-8 sm:p-12 transition-transform duration-300 hover:scale-[1.01]">
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#07767c]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                
                {/* Content */}
                <div className="relative z-10">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 tracking-tight">
                        ¿Qué te gustaría hacer?
                    </h2>
                    
                    {/* Cards Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
                        
                        {/* Card 1: Buscar FreeLancer */}
                        <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#07767c]/30 hover:-translate-y-2">
                            <div className="p-6 sm:p-8">
                                {/* Icon */}
                                <div className="w-14 h-14 bg-gradient-to-br from-[#07767c] to-[#0a474f] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg 
                                        className="w-7 h-7 text-white" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                        />
                                    </svg>
                                </div>
                                
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 border-b-2 border-[#07767c] pb-2">
                                    Buscar FreeLancer
                                </h3>
                                
                                <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                                    Encuentra los mejores talentos para tu proyecto
                                </p>
                                
                                <Link to="/findfreelancer" className="block">
                                    <button className="w-full bg-gradient-to-r from-[#07767c] to-[#0a474f] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                                        Buscar FreeLancer
                                    </button>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Card 2: Publicar Proyecto */}
                        <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#07767c]/30 hover:-translate-y-2">
                            <div className="p-6 sm:p-8">
                                {/* Icon */}
                                <div className="w-14 h-14 bg-gradient-to-br from-[#07767c] to-[#0a474f] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg 
                                        className="w-7 h-7 text-white" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M12 4v16m8-8H4" 
                                        />
                                    </svg>
                                </div>
                                
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 border-b-2 border-[#07767c] pb-2">
                                    Publicar Proyecto
                                </h3>
                                
                                <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                                    Publica un proyecto y permite que los freelancers te encuentren
                                </p>
                                
                                <Link to="/myprojects" className="block">
                                    <button className="w-full bg-gradient-to-r from-[#07767c] to-[#0a474f] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                                        Publicar Proyecto
                                    </button>
                                </Link>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmpresaActionsCard;