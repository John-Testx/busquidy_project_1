import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Home/Navbar";
import PublicationsContainer from "@/components/Publications/PublicationsContainer";
import Footer from "@/components/Home/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks";

function ProjectList() {
    const [logoutStatus, setLogoutStatus] = useState("");
    const navigate = useNavigate();
    
    // Usar el custom hook para toda la lógica de autenticación
    const { 
        isAuthenticated, 
        tipo_usuario, 
        id_usuario, 
        loading, 
        logout 
    } = useAuth();

    const handleLogout = () => {
        setLogoutStatus("Cerrando sesión...");
        
        // Usar la función logout del hook
        logout();
        
        setTimeout(() => {
            setLogoutStatus("Sesión cerrada");
            
            setTimeout(() => {
                navigate("/");
            }, 1000);
        }, 500);
    };

    return (
        <div className="mt-20">
            {loading && <LoadingScreen />}
            
            <Navbar />
            
            <PublicationsContainer 
                userType={tipo_usuario} 
                id_usuario={id_usuario} 
            />
            
            <Footer />
            
            {logoutStatus && (
                <div className="fixed bottom-4 right-4 bg-[#07767c] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-[modalSlideIn_0.3s_ease-out]">
                    {logoutStatus}
                </div>
            )}
        </div>
    );
}

export default ProjectList;