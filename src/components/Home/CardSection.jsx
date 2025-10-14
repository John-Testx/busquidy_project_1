import React from "react";
import { Link } from "react-router-dom";
import { 
  UserCircle, 
  Building2, 
  Briefcase, 
  FileText, 
  Search,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

function CardSection({ userType }) {
    return (
        <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-[#e6f7f1] overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#07767c]/5 rounded-full blur-3xl -ml-48 -mt-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#40E0D0]/5 rounded-full blur-3xl -mr-48 -mb-48"></div>
            
            <div className="relative max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-[#07767c]/10 px-4 py-2 rounded-full mb-4">
                        <Sparkles size={18} className="text-[#07767c]" />
                        <span className="text-[#07767c] font-semibold text-sm">Únete a nuestra comunidad</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                        Elige tu camino profesional
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Ya seas freelancer o empresa, tenemos las herramientas perfectas para ti
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    
                    {/* Tarjeta FreeLancer */}
                    <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-[#07767c]/20">
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#07767c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#07767c]/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
                        
                        <div className="relative p-8 sm:p-10">
                            {/* Icon Badge */}
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                <UserCircle className="text-white" size={32} />
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-[#07767c] transition-colors">
                                FREELANCER
                            </h2>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed mb-6 text-base">
                                Busca proyectos de tu interés, publica tu CV y muestra tu perfil a miles de empresas que buscan tu talento.
                            </p>

                            {/* Features List */}
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-5 h-5 bg-[#40E0D0]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Search size={12} className="text-[#07767c]" />
                                    </div>
                                    <span>Accede a proyectos ilimitados</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-5 h-5 bg-[#40E0D0]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FileText size={12} className="text-[#07767c]" />
                                    </div>
                                    <span>Publica tu CV profesional</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-5 h-5 bg-[#40E0D0]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <TrendingUp size={12} className="text-[#07767c]" />
                                    </div>
                                    <span>Aumenta tu visibilidad</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Link to="/freelancer" className="block">
                                <button className="group/btn w-full bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-[#055a5f] hover:to-[#043d42] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1">
                                    <span>{userType === "freelancer" ? "Ir a mi panel" : "Comenzar como Freelancer"}</span>
                                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            {/* Stats badge */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <Users size={16} className="text-[#07767c]" />
                                    <span className="text-gray-600">
                                        Únete a <span className="font-bold text-[#07767c]">+10,000</span> freelancers
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta Empresa */}
                    <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-[#40E0D0]/20">
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#40E0D0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#40E0D0]/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
                        
                        <div className="relative p-8 sm:p-10">
                            {/* Icon Badge */}
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#40E0D0] to-[#20B0A0] rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                <Building2 className="text-white" size={32} />
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-[#40E0D0] transition-colors">
                                EMPRESA
                            </h2>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed mb-6 text-base">
                                Publica proyectos, encuentra freelancers talentosos y haz crecer tu negocio con los mejores profesionales.
                            </p>

                            {/* Features List */}
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-5 h-5 bg-[#07767c]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Briefcase size={12} className="text-[#40E0D0]" />
                                    </div>
                                    <span>Publica proyectos ilimitados</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-5 h-5 bg-[#07767c]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Search size={12} className="text-[#40E0D0]" />
                                    </div>
                                    <span>Encuentra freelancers verificados</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-5 h-5 bg-[#07767c]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <TrendingUp size={12} className="text-[#40E0D0]" />
                                    </div>
                                    <span>Impulsa tu crecimiento</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Link to="/empresa" className="block">
                                <button className="group/btn w-full bg-gradient-to-r from-[#40E0D0] to-[#20B0A0] hover:from-[#20B0A0] hover:to-[#10A090] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1">
                                    <span>{userType === "empresa" ? "Ir a mi panel" : "Comenzar como Empresa"}</span>
                                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            {/* Stats badge */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <Building2 size={16} className="text-[#40E0D0]" />
                                    <span className="text-gray-600">
                                        Únete a <span className="font-bold text-[#40E0D0]">+5,000</span> empresas
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <p className="text-gray-600 mb-4">
                        ¿No estás seguro cuál opción elegir?
                    </p>
                    <button className="text-[#07767c] font-semibold hover:text-[#055a5f] transition-colors inline-flex items-center gap-2 group">
                        Compara las opciones
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CardSection;