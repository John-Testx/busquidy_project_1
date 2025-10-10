import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Home/Navbar";
//import NavbarEmpresa from "../../components/Empresa/NavbarEmpresa";
//import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import ViewProjects from "../../components/Empresa/Projects/ViewProjects";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen"; 

function MyProjects() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logoutStatus, setLogoutStatus] = useState("");
    const [userType, setUserType] = useState(null);
    const [id_usuario, setIdUsuario] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');    
            setIsAuthenticated(!!token);

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUserType(decoded.tipo_usuario);
                    setIdUsuario(decoded.id_usuario);
                } catch (error) {
                    console.error("Error decodificando el token:", error);
                    setIsAuthenticated(false);
                }
            }

            setLoading(false);
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    useEffect(() => {
        const handlePaymentResponse = async () => {
            const searchParams = new URLSearchParams(location.search);
            const token_ws = searchParams.get("token_ws");
            const TBK_TOKEN = searchParams.get("TBK_TOKEN");

            if (!token_ws && !TBK_TOKEN) return;

            setLoading(true);

            try {
                if (TBK_TOKEN) {
                    setPaymentStatus({
                        success: false,
                        message: "El pago fue cancelado.",
                        type: "CANCELLED",
                    });
                } else {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/payments/commit_transaction`,
                        { token: token_ws }
                    );

                    const data = response.data;

                    if (data.status === "APPROVED") {
                        const details =
                            data.type === "SUBSCRIPTION"
                                ? {
                                      plan: data.plan,
                                      subscriptionStart: data.subscriptionStart,
                                      subscriptionEnd: data.subscriptionEnd,
                                  }
                                : data.type === "PROJECT_PUBLICATION"
                                ? { projectId: data.projectId }
                                : {};

                        setPaymentStatus({
                            success: true,
                            message: data.message || "Pago procesado exitosamente.",
                            type: data.type,
                            details: {
                                amount: data.amount,
                                buyOrder: data.buyOrder,
                                ...details,
                            },
                        });
                    } else if (data.status === "REJECTED") {
                        setPaymentStatus({
                            success: false,
                            message: data.message || "Pago rechazado.",
                            type: data.type,
                            reason: data.reason,
                            details: {
                                amount: data.amount,
                                buyOrder: data.buyOrder,
                            },
                        });
                    } else {
                        setPaymentStatus({
                            success: false,
                            message: data.error || "Error inesperado al procesar el pago.",
                            type: "ERROR",
                            code: data.code,
                            details: data.details,
                        });
                    }
                }
            } catch (error) {
                console.error("Error procesando el pago:", error);
                setPaymentStatus({
                    success: false,
                    message:
                        error.response?.data?.error ||
                        "Error de red al procesar el pago. Intenta de nuevo.",
                    type: "NETWORK_ERROR",
                    code: error.response?.data?.code || "UNKNOWN_ERROR",
                    details: error.response?.data || error.message,
                });
            } finally {
                const newURL = `${window.location.origin}${window.location.pathname}`;
                window.history.replaceState({}, document.title, newURL);
                setLoading(false);
                setTimeout(() => setPaymentStatus(null), 5000);
            }
        };

        handlePaymentResponse();
    }, [location.search]);

    const renderNavbar = () => {
        return <Navbar />;
    };

    return (
        <div className="mt-20">
            {loading && <LoadingScreen />}

            {renderNavbar()}

            <div className="bg-gradient-to-br from-teal-50 to-cyan-100 min-h-screen pt-6">
                {userType && userType !== "empresa" ? (
                    <div className="max-w-2xl mx-auto mt-24 p-8 text-center bg-red-50 border border-red-200 rounded-lg">
                        <h2 className="text-2xl font-bold text-red-800 mb-4">Acceso Restringido</h2>
                        <p className="text-red-700 mb-2">Para utilizar esta función necesitas ser un usuario de tipo empresa.</p>
                        <p className="text-red-700">Si eres un freelancer o usuario regular, por favor regístrate como empresa para acceder a estas funcionalidades.</p>
                    </div>
                ) : (
                    <ViewProjects 
                        userType={userType} 
                        id_usuario={id_usuario}
                    />
                )}

                {paymentStatus && !loading && (
                    <div
                        className={`fixed top-24 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 w-11/12 max-w-lg text-center transition-all duration-300 animate-[slideIn_0.5s_ease-out] ${
                            paymentStatus.success 
                                ? 'bg-green-50 text-green-800 border border-green-200' 
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                    >
                        {paymentStatus.message}
                    </div>
                )}

                {logoutStatus && (
                    <div className="fixed left-1/2 transform -translate-x-1/2 bg-gray-50 p-4 rounded-lg shadow-md z-50 animate-[slideIn_0.5s_ease-out]">
                        {logoutStatus}
                    </div>
                )}

                <Footer />
            </div>
        </div>
    );
}

export default MyProjects;