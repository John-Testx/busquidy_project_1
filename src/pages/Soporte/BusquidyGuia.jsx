import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks";
import FAQSection from "@/components/Soporte/FAQSection ";
import { Footer, Navbar } from '@/components/Home/';

function BusquidyGuia() {

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
                    <>
                        {console.log("Rendering soporte for unknown user type")}
                        <FAQSection userType={tipo_usuario} />
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

export default BusquidyGuia;
