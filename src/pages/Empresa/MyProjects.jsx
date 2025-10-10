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
// import "./MyProjects.css";
import useAuth from "../../hooks/useAuth";

function MyProjects() {
    const [logoutStatus, setLogoutStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Use your custom hook
    const {
        isAuthenticated,
        tipo_usuario: userType,
        id_usuario,
        loading,
        refresh,
    } = useAuth();

    useEffect(() => {
        const handlePaymentResponse = async () => {
            const searchParams = new URLSearchParams(location.search);
            const token_ws = searchParams.get("token_ws");
            const TBK_TOKEN = searchParams.get("TBK_TOKEN");

            if (!token_ws && !TBK_TOKEN) return;

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
                    message: error.response?.data?.error || "Error de red al procesar el pago. Intenta de nuevo.",
                    type: "NETWORK_ERROR",
                    code: error.response?.data?.code || "UNKNOWN_ERROR",
                    details: error.response?.data || error.message,
                });
            } finally {
                const newURL = `${window.location.origin}${window.location.pathname}`;
                window.history.replaceState({}, document.title, newURL);
                setTimeout(() => setPaymentStatus(null), 5000);
            }
        };

        handlePaymentResponse();
    }, [location.search]);

    if (loading) return <LoadingScreen />;

    if (!isAuthenticated) {
        return (
            <div className="mt-20">
                <Navbar />
                <div className="max-w-lg mx-auto mt-24 p-8 text-center bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
                    <p>Debes iniciar sesión para acceder a tus proyectos.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900 transition"
                    >
                        Ir al Login
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (userType !== "empresa") {
        return (
            <div className="mt-20">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-24 p-8 text-center bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
                    <p>Esta sección está disponible solo para usuarios de tipo empresa.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="mt-20">
            <Navbar />

            <div className="bg-gradient-to-br from-teal-50 to-cyan-100 min-h-screen pt-6">
                <ViewProjects userType={userType} id_usuario={id_usuario} />

                {paymentStatus && (
                    <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 w-11/12 max-w-lg text-center transition-all duration-300 ${
                        paymentStatus.success
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {paymentStatus.message}
                    </div>
                )}

                {logoutStatus && (
                    <div className="fixed left-1/2 transform -translate-x-1/2 bg-gray-50 p-4 rounded-lg shadow-md z-50">
                        {logoutStatus}
                    </div>
                )}

                <Footer />
            </div>
        </div>
    );
}

export default MyProjects;