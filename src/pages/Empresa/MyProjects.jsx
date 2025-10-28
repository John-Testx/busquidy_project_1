import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import ViewProjects from "@/components/Empresa/Projects/ViewProjects";
import { useAuth } from "@/hooks";
import { usePaymentCallback } from "@/hooks";
import MainLayout from "@/components/Layouts/MainLayout";

function MyProjects() {
    const [logoutStatus, setLogoutStatus] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const {
        isAuthenticated,
        tipo_usuario: userType,
        id_usuario,
        loading,
        refresh,
    } = useAuth();

    const { paymentStatus, processPaymentCallback, clearPaymentStatus } = usePaymentCallback();

    useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    if (searchParams.has('token_ws') || searchParams.has('TBK_TOKEN')) {
        processPaymentCallback(searchParams);
        
        // Limpiar URL inmediatamente para evitar reprocesamiento
        const newURL = `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState({}, document.title, newURL);
    }
    }, [location.search, processPaymentCallback]); // ✅ Agregar dependencias

    // Auto-cerrar notificación y recargar si es exitoso
    useEffect(() => {
        if (paymentStatus?.success && paymentStatus?.type === "PROJECT_PUBLICATION") {
            const timer = setTimeout(() => {
                console.log('✅ Pago exitoso, recargando página...');
                sessionStorage.removeItem('processing_token');
                sessionStorage.removeItem('processed_token');
                window.location.reload();
            }, 3000); // 3 segundos para que el usuario vea el mensaje

            return () => clearTimeout(timer);
        } else if (paymentStatus && !paymentStatus.success) {
            // Para errores, solo cerrar la notificación
            const timer = setTimeout(() => {
                clearPaymentStatus();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [paymentStatus, clearPaymentStatus]);

    if (loading) return <LoadingScreen />;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col">
                <MainLayout >
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
                </MainLayout>
            </div>
        );
    }

    if (userType !== "empresa") {
        return (
            <div className="min-h-screen flex flex-col">
                <MainLayout >
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
                </ MainLayout>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <MainLayout >

            <div className="flex-1 bg-gradient-to-br from-teal-50 via-cyan-50 to-white pt-24 pb-12 px-4">
                <ViewProjects userType={userType} id_usuario={id_usuario} />

                {paymentStatus && (
                    <div 
                        className={`fixed top-24 left-1/2 transform -translate-x-1/2 p-5 rounded-xl shadow-2xl z-50 w-11/12 max-w-lg text-center transition-all duration-300 animate-[slideIn_0.5s_ease-out] backdrop-blur-sm ${
                            paymentStatus.success
                                ? 'bg-emerald-50/95 text-emerald-800 border-2 border-emerald-300'
                                : paymentStatus.type === 'PROCESSING'
                                ? 'bg-blue-50/95 text-blue-800 border-2 border-blue-300'
                                : 'bg-red-50/95 text-red-800 border-2 border-red-300'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-3">
                            {paymentStatus.success ? (
                                <svg className="w-6 h-6 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : paymentStatus.type === 'PROCESSING' ? (
                                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

            </ MainLayout>
        </div>
    );
}

export default MyProjects;