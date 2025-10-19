import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import LoadingScreen from "@/components/LoadingScreen"; 
import PerfilFreelancerEmpresaView from "@/components/Empresa/FreelancerList/PerfilFreelancerEmpresaView";
import useAuth from "@/hooks/useAuth";
import useFreelancerProfile from "@/hooks/useFreelancerProfile";
import { getEmpresaProfile } from "@/api/freelancerApi";

function ViewFreelancer() {
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null); 
    const navigate = useNavigate(); 
    const { id_usuario, isAuthenticated, loading: authLoading } = useAuth();
    const { id } = useParams();
    
    // Usar el custom hook para obtener el perfil del freelancer
    const { 
        freelancer, 
        loading: freelancerLoading, 
        error: freelancerError 
    } = useFreelancerProfile(id);

    // Verificar el perfil de la empresa si el usuario está autenticado
    useEffect(() => {
        const fetchPerfilEmpresa = async () => {
            if (id_usuario) {
                try {
                    const data = await getEmpresaProfile(id_usuario);
                    console.log("Se verificó el perfil de la empresa");
                    setIsPerfilIncompleto(data.isPerfilIncompleto);
                } catch (error) {
                    console.error("Error al verificar el perfil de la empresa:", error);
                }
            }
        };

        fetchPerfilEmpresa();
    }, [id_usuario]);

    // Loading combinado
    const isLoading = authLoading || freelancerLoading;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {isLoading && <LoadingScreen />}
            <Navbar />
            
            <main className="flex-1 pt-24 pb-16">
                {freelancerError ? (
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <i className="fas fa-exclamation-circle text-red-500 text-4xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-red-800 mb-2">
                                Error al cargar el perfil
                            </h2>
                            <p className="text-red-700 mb-6">
                                {typeof freelancerError === 'string' 
                                    ? freelancerError 
                                    : 'No pudimos encontrar los datos del freelancer. Por favor, intenta nuevamente.'}
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200"
                            >
                                <i className="fas fa-home"></i>
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                ) : freelancer ? (
                    <PerfilFreelancerEmpresaView freelancer={freelancer} />
                ) : (
                    !isLoading && (
                        <div className="max-w-5xl mx-auto px-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="animate-spin">
                                        <i className="fas fa-spinner text-4xl text-teal-600"></i>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-lg">
                                    Cargando perfil del freelancer...
                                </p>
                            </div>
                        </div>
                    )
                )}
            </main>

            <Footer />
        </div>
    );
}

export default ViewFreelancer;