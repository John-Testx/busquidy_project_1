import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Home/Navbar";
import SearchFilters from "../../components/Empresa/FreelancerList/SearchFilters";
import FreelancerList from "../../components/Empresa/FreelancerList/FreelancerList";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen";

function FindFreelancer() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logoutStatus, setLogoutStatus] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [userType, setUserType] = useState("");
    const [id_usuario, setIdUsuario] = useState(null);
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');    
            setIsAuthenticated(!!token);
            
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    console.log("Decoded token:", decoded);
                    setUserType(decoded.tipo_usuario);
                    setIdUsuario(decoded.id_usuario);
                } catch (error) {
                    console.error("Error decodificando el token:", error);
                }
            }
            
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };
     
        window.addEventListener('storage', checkAuth);
        checkAuth();
   
        return () => window.removeEventListener('storage', checkAuth);
    }, []);
    
    useEffect(() => {
        if (id_usuario) {
            console.log("ID usuario actualizado:", id_usuario);
        }
    }, [id_usuario]);
    
    const handleLogout = () => {
        setLoading(true);
        setLogoutStatus("Cerrando sesión...");
        setShowNotification(true);
        
        setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("correo");
            setIsAuthenticated(false);
            setUserType(null);
            setLogoutStatus("Sesión cerrada");
            
            setTimeout(() => {
                setLoading(false);
                navigate("/");
                setShowNotification(false);
            }, 1000);
        });
    };
    
    const renderNavbar = () => {
        return <Navbar />;
    };
   
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f7f9] to-white">
            {loading && <LoadingScreen />}
            
            {renderNavbar()}
            
            {/* Main Content */}
            <main className="flex-1 mt-20 w-full">
                {/* Hero Section */}
                <div className="w-full bg-gradient-to-r from-[#07767c]/10 via-[#f0f7f9] to-[#07767c]/10 py-8 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Encuentra el Talento Perfecto
                            </h1>
                            <p className="text-lg text-gray-600">
                                Conecta con universitarios talentosos para tu proyecto
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Freelancer List Container */}
                <div className="w-full bg-[#f0f7f9] py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-8">
                            <FreelancerList userType={userType} id_usuario={id_usuario} />
                        </div>
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