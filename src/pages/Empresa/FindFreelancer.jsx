import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import FreelancerList from "@/components/Empresa/FreelancerList/FreelancerList";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks";
import { Footer, Navbar } from '@/components/Home/';

function FindFreelancer() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [logoutStatus, setLogoutStatus] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
    const {id_usuario, tipo_usuario, loading} = useAuth();
        
    useEffect(() => {
        if (id_usuario) {
            console.log("ID usuario actualizado:", id_usuario);
        }
    }, [id_usuario]);

    if (loading) return <LoadingScreen />;
    
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">            
            <Navbar/>
            
            {/* Main Content */}
            <main className="flex-1 pt-20 w-full">
                {/* Hero Section Mejorado */}
                <div className="w-full bg-gradient-to-br from-[#07767c] via-[#05595d] to-[#043d42] py-16 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#40E0D0]/10 rounded-full blur-3xl"></div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/20">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                                </svg>
                                <span className="font-semibold text-sm">+500 Freelancers Disponibles</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                Encuentra el Talento 
                                <span className="block mt-2 bg-gradient-to-r from-[#40E0D0] to-white bg-clip-text text-transparent">
                                    Perfecto para tu Proyecto
                                </span>
                            </h1>
                            
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Conecta con universitarios talentosos, verificados y listos para trabajar
                            </p>
                            
                            {/* Stats */}
                            <div className="flex flex-wrap justify-center gap-8 mt-10">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white mb-1">500+</div>
                                    <div className="text-sm text-white/70">Freelancers</div>
                                </div>
                                <div className="w-px h-12 bg-white/20"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white mb-1">4.8★</div>
                                    <div className="text-sm text-white/70">Calificación Promedio</div>
                                </div>
                                <div className="w-px h-12 bg-white/20"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white mb-1">1000+</div>
                                    <div className="text-sm text-white/70">Proyectos Completados</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Freelancer List Container */}
                <div className="w-full py-12 -mt-8 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <FreelancerList userType={tipo_usuario} id_usuario={id_usuario} />
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

export default FindFreelancer;