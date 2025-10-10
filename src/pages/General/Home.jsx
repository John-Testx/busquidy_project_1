import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Home/Navbar";
//import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import CardSection from "../../components/Home/CardSection";
import InfoSectionHome from "../../components/Home/InfoSectionHome";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen";
import useAuth from "../../hooks/useAuth";
import LittleSearchSection from "../../components/FreeLancer/LittleSearchSection";
import InfoSectionFreelancer from "../../components/FreeLancer/InfoSectionFreelancer";
import EmpresaActionsCard from "../../components/Empresa/EmpresaActionsCard";
import InfoSectionEmpresa from "../../components/Empresa/InfoSectionEmpresa";

function Home() {

    const [logoutStatus, setLogoutStatus] = useState("");
    const [userType, setUserType] = useState(null);
    const { isAuthenticated, tipo_usuario, id_usuario, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Merge auth loading with local loading
    useEffect(() => {
        if (!authLoading) setLoading(false);
    }, [authLoading]);
    
    // Renderización condicional del navbar según el tipo de usuario
    const renderNavbar = () => {
        return <Navbar />;
    };
    
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <div className="main-content" style={{ flex: 1, marginTop: "80px" }}>

                {/* Muestra la pantalla de carga si está activa */}
                {loading && <LoadingScreen />}

                {/* Renderiza el navbar correcto */}
                {renderNavbar()}

                {/* {tipo_usuario === null ? (
                    <>
                        {console.log("Rendering home for unauthenticated user")}
                        <CardSection userType={tipo_usuario} />
                        <InfoSectionHome tipo_usuario={tipo_usuario} id_usuario={id_usuario} />
                    </>
                ) : tipo_usuario === "empresa" ? (
                    <>
                        {console.log("Rendering home for empresa")}
                        <EmpresaActionsCard />
                        <InfoSectionEmpresa />
                    </>
                ) : tipo_usuario === "freelancer" ? (
                    <>
                        {console.log("Rendering home for freelancer")}
                        <LittleSearchSection/>
                        <InfoSectionFreelancer/>
                    </>
                ) : (
                    <>
                        {console.log("Rendering home for unknown user type")}
                        <CardSection userType={tipo_usuario} />
                        <InfoSectionHome tipo_usuario={tipo_usuario} id_usuario={id_usuario} />
                    </>
                )} */}

                    <>
                        {console.log("Rendering home for unknown user type")}
                        <CardSection userType={tipo_usuario} />
                        <InfoSectionHome tipo_usuario={tipo_usuario} id_usuario={id_usuario} />
                    </>
                    <Footer />

                {/* Mensaje de estado de cierre de sesión */}
                {logoutStatus && (
                    <div className="logout-status-msg">
                        {logoutStatus}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
