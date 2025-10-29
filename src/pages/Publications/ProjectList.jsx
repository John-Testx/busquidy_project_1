import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicationsContainer from "@/components/Publications/PublicationsContainer";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks";
import MainLayout from "@/components/Layouts/MainLayout";

function ProjectList() {
    const [logoutStatus, setLogoutStatus] = useState("");
    const navigate = useNavigate();
    
    const { 
        isAuthenticated, 
        tipo_usuario, 
        id_usuario, 
        loading, 
        logout 
    } = useAuth();

    return (
        <MainLayout noPadding>
            {loading && <LoadingScreen />}
            
            <div className="pt-19 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
                <PublicationsContainer 
                    userType={tipo_usuario} 
                    id_usuario={id_usuario} 
                />
            </div>
            
            {logoutStatus && (
                <div className="fixed bottom-4 right-4 bg-[#07767c] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-[modalSlideIn_0.3s_ease-out]">
                    {logoutStatus}
                </div>
            )}
        </MainLayout>
    );
}

export default ProjectList;