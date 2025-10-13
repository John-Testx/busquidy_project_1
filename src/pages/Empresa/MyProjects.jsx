import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Home/Navbar";
import ViewProjects from "../../components/Empresa/Projects/ViewProjects";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen"; 
import useAuth from "../../hooks/useAuth";

function MyProjects() {
    const [logoutStatus, setLogoutStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

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
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-white px-4">
                    <div className="max-w-lg w-full p-8 text-center bg-white border-2 border-red-200 rounded-2xl shadow-xl">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-3 text-gray-900">Acceso Denegado</h2>
                            <p className="text-gray-600 text-lg">Debes iniciar sesión para acceder a tus proyectos.</p>
                        </div>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-semibold rounded-lg hover:from-[#05595d] hover:to-[#044449] transform hover:scale-105 transition-all duration-200 shadow-md"
                        >
                            Ir al Login
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (userType !== "empresa") {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-white px-4">
                    <div className="max-w-2xl w-full p-8 text-center bg-white border-2 border-amber-200 rounded-2xl shadow-xl">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-3 text-gray-900">Acceso Restringido</h2>
                            <p className="text-gray-600 text-lg">Esta sección está disponible solo para usuarios de tipo empresa.</p>
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-semibold rounded-lg hover:from-[#05595d] hover:to-[#044449] transform hover:scale-105 transition-all duration-200 shadow-md"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 bg-gradient-to-br from-teal-50 via-cyan-50 to-white pt-24 pb-12 px-4">
                <ViewProjects userType={userType} id_usuario={id_usuario} />

                {paymentStatus && (
                    <div 
                        className={`fixed top-24 left-1/2 transform -translate-x-1/2 p-5 rounded-xl shadow-2xl z-50 w-11/12 max-w-lg text-center transition-all duration-300 animate-[slideIn_0.5s_ease-out] backdrop-blur-sm ${
                            paymentStatus.success
                                ? 'bg-emerald-50/95 text-emerald-800 border-2 border-emerald-300'
                                : 'bg-red-50/95 text-red-800 border-2 border-red-300'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-3">
                            {paymentStatus.success ? (
                                <svg className="w-6 h-6 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            <span className="font-semibold text-base">{paymentStatus.message}</span>
                        </div>
                    </div>
                )}

                {logoutStatus && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-2xl z-50 border-2 border-gray-200 animate-[slideIn_0.5s_ease-out] max-w-md">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#07767c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-800 font-medium">{logoutStatus}</span>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default MyProjects;