import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Home/Navbar";
import Footer from "../../components/Home/Footer";
import EmpresaActionsCard from "../../components/Empresa/PanelEmpresa/EmpresaActionsCard";
import InfoSectionEmpresa from "../../components/Empresa/PanelEmpresa/InfoSectionEmpresa";
import LoadingScreen from "../../components/LoadingScreen"; 
import useAuth from "../../hooks/useAuth";

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
    
    const profileLinks = [
        { label: "Mi perfil", link: "/viewperfilempresa", icon: "bi bi-person" },
        { label: "Mis publicaciones", link: "/myprojects", icon: "bi bi-file-earmark-text" },
        { label: "Mejorar Busquidy", link: "#", icon: "bi bi-arrow-up-right-circle" }
    ];
    
    const renderNavbar = () => {
        return <Navbar />;
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
            {loading && <LoadingScreen />}
            
            {renderNavbar()}
            
            {/* Main Content Container */}
            <main className="flex-1 mt-20 w-full">
                {/* Hero Section with subtle gradient */}
                <div className="w-full bg-gradient-to-r from-[#07767c]/5 to-transparent py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Panel de Empresa
                            </h1>
                            <p className="text-lg text-gray-600">
                                Gestiona tus proyectos y encuentra el talento perfecto
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Actions Card Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <EmpresaActionsCard />
                </div>
                
                {/* Info Section */}
                <div className="w-full bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <InfoSectionEmpresa />
                    </div>
                </div>
            </main>
            
            <Footer />
            
            {/* Logout Notification - Animated Toast */}
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

export default Empresa;