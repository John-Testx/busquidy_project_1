import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import EmpresaActionsCard from "@/components/Empresa/PanelEmpresa/EmpresaActionsCard";
import InfoSectionEmpresa from "@/components/Empresa/PanelEmpresa/InfoSectionEmpresa";
import LoadingScreen from "@/components/LoadingScreen"; 
import { useAuth } from "@/hooks";
import { Footer, Navbar } from '@/components/Home/';
import { Building2, TrendingUp, Users, Briefcase } from 'lucide-react';

function Empresa() {
    const [logoutStatus, setLogoutStatus] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();
    
    const { isAuthenticated, tipo_usuario: userType, loading, logout } = useAuth();
    
    const handleLogout = () => {
        setLogoutStatus("Cerrando sesión...");
        setShowNotification(true);
        
        setTimeout(() => {
            logout();
            setLogoutStatus("Sesión cerrada");
            
            setTimeout(() => {
                navigate("/");
                setShowNotification(false);
            }, 500);
        }, 500);
    };

    // Stats data (estos podrían venir de una API)
    const stats = [
        {
            icon: <Briefcase size={24} />,
            value: "0",
            label: "Proyectos Activos",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <Users size={24} />,
            value: "0",
            label: "Freelancers Contratados",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: <TrendingUp size={24} />,
            value: "0",
            label: "Postulaciones Recibidas",
            color: "from-green-500 to-green-600"
        }
    ];
    
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {loading && <LoadingScreen />}
            
            <Navbar />
            
            {/* Main Content Container */}
            <main className="flex-1 pt-20 w-full">
                {/* Hero Section con diseño mejorado */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#07767c] via-[#05595d] to-[#043d42] py-16">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#40E0D0]/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Welcome Section */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/20">
                                <Building2 size={18} />
                                <span className="font-semibold text-sm">Panel de Control</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                Bienvenido a tu 
                                <span className="block mt-2 bg-gradient-to-r from-[#40E0D0] to-white bg-clip-text text-transparent">
                                    Panel de Empresa
                                </span>
                            </h1>
                            
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                Gestiona tus proyectos, encuentra talento y haz crecer tu negocio
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {stats.map((stat, index) => (
                                <div 
                                    key={index}
                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                            <span className="text-white">
                                                {stat.icon}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                        <p className="text-white/80 text-sm">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Actions Card Section con margen negativo para superposición */}
                <div className="relative -mt-8 z-20">
                    <EmpresaActionsCard />
                </div>
                
                {/* Quick Links Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <QuickLinkCard
                            icon={<Building2 size={24} />}
                            title="Mi Perfil"
                            description="Actualiza tu información"
                            link="/company-profile"
                            color="from-[#07767c] to-[#05595d]"
                        />
                        <QuickLinkCard
                            icon={<Briefcase size={24} />}
                            title="Mis Publicaciones"
                            description="Gestiona tus proyectos"
                            link="/myprojects"
                            color="from-blue-600 to-blue-700"
                        />
                        <QuickLinkCard
                            icon={<Users size={24} />}
                            title="Freelancers"
                            description="Encuentra talento"
                            link="/findfreelancer"
                            color="from-purple-600 to-purple-700"
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <InfoSectionEmpresa />
                    </div>
                </div>

                {/* CTA Section */}
                <div className="w-full bg-gradient-to-br from-[#07767c] to-[#043d42] py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            ¿Listo para comenzar?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Publica tu primer proyecto y conecta con los mejores freelancers
                        </p>
                        <button
                            onClick={() => navigate('/myprojects')}
                            className="inline-flex items-center gap-3 bg-white text-[#07767c] px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <Briefcase size={20} />
                            Publicar Proyecto Ahora
                        </button>
                    </div>
                </div>
            </main>
            
            <Footer />
            
            {/* Logout Notification */}
            {showNotification && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[modalSlideIn_0.3s_ease-out]">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            {logoutStatus === "Cerrando sesión..." ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="font-medium text-sm">{logoutStatus}</span>
                                </>
                            ) : (
                                <>
                                    <svg 
                                        className="w-5 h-5 text-green-400" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M5 13l4 4L19 7" 
                                        />
                                    </svg>
                                    <span className="font-medium text-sm">{logoutStatus}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Componente para Quick Links
const QuickLinkCard = ({ icon, title, description, link, color }) => {
    const navigate = useNavigate();
    
    return (
        <div
            onClick={() => navigate(link)}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-transparent"
        >
            <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white">
                    {icon}
                </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#07767c] transition-colors">
                {title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
                {description}
            </p>
            <div className="flex items-center gap-2 text-[#07767c] font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                <span>Ir ahora</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
};

export default Empresa;