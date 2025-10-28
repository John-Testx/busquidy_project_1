import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicationsContainer from "@/components/Publications/PublicationsContainer";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks";
import MainLayout from "@/components/Layouts/MainLayout";

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

return (
        <MainLayout noPadding>
            
            {/* Si 'loading' es true, mostramos el overlay */}
            {loading && <LoadingScreen />}
            
            <div className="pt-20 bg-gradient-to-br from-gray-50 to-gray-100">
                <PublicationsContainer 
                    userType={tipo_usuario} 
                    id_usuario={id_usuario} 
                />
            </div>
            
            {/* El overlay de 'logoutStatus' también puede ir aquí sin problema */}
            {logoutStatus && (
                <div className="fixed bottom-4 right-4 bg-[#07767c] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-[modalSlideIn_0.3s_ease-out]">
                    {logoutStatus}
                </div>
            )}
        </MainLayout>
    );
}

export default ProjectList;