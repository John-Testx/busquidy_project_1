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
import "./MyProjects.css";
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

        if (!token_ws && !TBK_TOKEN) return; // No hay pago pendiente

        setLoading(true);

        try {
            if (TBK_TOKEN) {
                // Pago cancelado
                setPaymentStatus({
                    success: false,
                    message: "El pago fue cancelado.",
                    type: "CANCELLED",
                });
            } else {
                // Confirmar pago en backend
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/payments/commit_transaction`,
                    { token: token_ws }
                );

                const data = response.data;

                if (data.status === "APPROVED") {
                    // Pago exitoso
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
                    // Pago rechazado
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
                    // Error inesperado
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
            // Limpiar parámetros de URL
            const newURL = `${window.location.origin}${window.location.pathname}`;
            window.history.replaceState({}, document.title, newURL);

            setLoading(false);

            // Limpiar mensaje después de 5 segundos
            setTimeout(() => setPaymentStatus(null), 5000);
        }
    };

    handlePaymentResponse();
}, [location.search]);
    
    // ✅ Conditional rendering
    if (loading) return <LoadingScreen />;

    if (!isAuthenticated) {
        return (
            <div style={{ marginTop: "80px" }}>
                <Navbar />
                <div
                    style={{
                        padding: "3rem",
                        margin: "5.4rem auto",
                        maxWidth: "600px",
                        textAlign: "center",
                        backgroundColor: "#f8d7da",
                        border: "1px solid #f5c6cb",
                        borderRadius: "5px",
                        color: "#721c24",
                    }}
                >
                    <h2 style={{ marginBottom: "1rem" }}>Acceso Denegado</h2>
                    <p>Debes iniciar sesión para acceder a tus proyectos.</p>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            backgroundColor: "#721c24",
                            color: "white",
                            padding: "0.5rem 1rem",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginTop: "1rem",
                        }}
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
            <div style={{ marginTop: "80px" }}>
                <Navbar />
                <div
                    style={{
                        padding: "3rem",
                        margin: "5.4rem auto",
                        maxWidth: "600px",
                        textAlign: "center",
                        backgroundColor: "#f8d7da",
                        border: "1px solid #f5c6cb",
                        borderRadius: "5px",
                        color: "#721c24",
                    }}
                >
                    <h2 style={{ marginBottom: "1rem" }}>Acceso Restringido</h2>
                    <p>Esta sección está disponible solo para usuarios de tipo empresa.</p>
                </div>
                <Footer />
            </div>
        );
    }

    // ✅ Authenticated empresa user view
    return (
        <div style={{ marginTop: "80px" }}>
            <Navbar />
            <div className="background-color-myproject">
                <ViewProjects userType={userType} id_usuario={id_usuario} />
                {paymentStatus && (
                    <div
                        className={`payment-status ${
                            paymentStatus.success ? "success" : "error"
                        }`}
                        style={{
                            position: "fixed",
                            top: "100px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "1rem",
                            margin: "1rem 0",
                            borderRadius: "5px",
                            backgroundColor: paymentStatus.success
                                ? "#d4edda"
                                : "#f8d7da",
                            color: paymentStatus.success
                                ? "#155724"
                                : "#721c24",
                            zIndex: 1000,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            width: "80%",
                            maxWidth: "500px",
                            textAlign: "center",
                        }}
                    >
                        {paymentStatus.message}
                    </div>
                )}
                {logoutStatus && <div className="logout-status-msg">{logoutStatus}</div>}
                <Footer />
            </div>
        </div>
    );
}

export default MyProjects;