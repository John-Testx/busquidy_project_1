import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Home/Navbar";
import NavbarEmpresa from "../../components/Empresa/NavbarEmpresa";
import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import Footer from "../../components/Home/Footer";
import EmpresaActionsCard from "../../components/Empresa/EmpresaActionsCard";
import LoadingScreen from "../../components/LoadingScreen"; 
import "./Empresa.css"
import useAuth from "../../hooks/useAuth";
import InfoSectionEmpresa from "../../components/Empresa/InfoSectionEmpresa";

function Empresa() {
    // Estado para los mensajes de logout
    const [logoutStatus, setLogoutStatus] = useState("");
    const navigate = useNavigate();

    // Usar hook centralizado
    const { isAuthenticated, tipo_usuario: userType, loading, logout } = useAuth();

    const handleLogout = () => {
        // Mensajes/animación local opcional
        setLogoutStatus("Cerrando sesión...");
        setTimeout(() => {
            logout();
            setLogoutStatus("Sesión cerrada");
            setTimeout(() => {
                navigate("/");
            }, 500);
        }, 500);
    };

    const profileLinks = [
    { label: "Mi perfil", link: "/viewperfilempresa", icon: "bi bi-person" },
    { label: "Mis publicaciones", link: "/myprojects", icon: "bi bi-file-earmark-text" },
    { label: "Mejorar Busquidy", link: "#", icon: "bi bi-arrow-up-right-circle" }
    
    ];

    // Renderización condicional del navbar según el tipo de usuario (ahora desde el hook)
    const renderNavbar = () => {
        if (!isAuthenticated) return <Navbar />;
        if (userType === "empresa") return <NavbarEmpresa onLogout={handleLogout} />;
        if (userType === "freelancer") return <NavbarFreeLancer onLogout={handleLogout} />;
        return <Navbar />;
    };

    return (
        <div style={{marginTop:"80px"}}>
            {loading && <LoadingScreen />} 

            
            {renderNavbar()}

            <EmpresaActionsCard />
            <InfoSectionEmpresa />
            <Footer />

            {logoutStatus && (
                <div className="logout-status-msg">
                    {logoutStatus}
                </div>
            )}
        </div>
    );
}

export default Empresa;
