import React from "react";
import { Link } from "react-router-dom";
import { Search, Plus, ArrowRight } from 'lucide-react';

function EmpresaActionsCard() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Cards Container con sombra elevada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                
                {/* Card 1: Buscar FreeLancer */}
                <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#07767c]/30 hover:-translate-y-2">
                    <div className="relative h-32 bg-gradient-to-br from-[#07767c] to-[#05595d] overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                        
                        <div className="relative z-10 p-6 flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Search className="text-white" size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    Buscar FreeLancer
                                </h3>
                                <p className="text-white/80 text-sm">
                                    Encuentra el talento ideal
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <p className="text-gray-600 text-base mb-6 leading-relaxed">
                            Explora nuestra comunidad de profesionales verificados y encuentra el freelancer perfecto para tu proyecto
                        </p>
                        
                        <Link to="/findfreelancer" className="block">
                            <button className="w-full bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                                <Search size={20} />
                                <span>Buscar Ahora</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
                
                {/* Card 2: Publicar Proyecto */}
                <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#07767c]/30 hover:-translate-y-2">
                    <div className="relative h-32 bg-gradient-to-br from-blue-600 to-blue-700 overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                        
                        <div className="relative z-10 p-6 flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Plus className="text-white" size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    Publicar Proyecto
                                </h3>
                                <p className="text-white/80 text-sm">
                                    Recibe propuestas de expertos
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <p className="text-gray-600 text-base mb-6 leading-relaxed">
                            Publica tu proyecto y permite que los freelancers calificados te encuentren y te envíen sus mejores propuestas
                        </p>
                        
                        <Link to="/myprojects" className="block">
                            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                                <Plus size={20} />
                                <span>Publicar Ahora</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default EmpresaActionsCard;