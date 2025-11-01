import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen"; 
import PerfilFreelancerEmpresaView from "@/components/Empresa/FreelancerList/PerfilFreelancerEmpresaView";
import { useAuth } from "@/hooks";
import { getFreelancerPublicProfile, getFreelancerPublicProfileByUserId } from "@/api/freelancerApi";
import { getEmpresaProfile } from "@/api/freelancerApi";
import { Footer, Navbar } from '@/components/Home/';

function ViewFreelancer() {
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const { id_usuario, isAuthenticated, loading: authLoading } = useAuth();
    const { id } = useParams();
    
    useEffect(() => {
        const fetchFreelancerProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log("Obteniendo perfil para id:", id);
                
                // ESTRATEGIA: Intentar primero con id_freelancer, si falla intentar con id_usuario
                let response;
                try {
                    // Intento 1: Asumir que es id_freelancer
                    response = await getFreelancerPublicProfile(id);
                    console.log("✅ Perfil encontrado usando id_freelancer");
                } catch (err) {
                    console.log("❌ No se encontró con id_freelancer, intentando con id_usuario...");
                    // Intento 2: Si falla, asumir que es id_usuario
                    response = await getFreelancerPublicProfileByUserId(id);
                    console.log("✅ Perfil encontrado usando id_usuario");
                }
                
                console.log("Datos recibidos:", response.data);
                setFreelancer(response.data);
            } catch (err) {
                console.error("❌ Error al obtener perfil:", err);
                setError(err.response?.data?.error || 'Error al cargar el perfil');
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchFreelancerProfile();
        }
    }, [id]);

    useEffect(() => {
        const fetchPerfilEmpresa = async () => {
            if (id_usuario && id_usuario !== id) {
                try {
                    const data = await getEmpresaProfile(id_usuario);
                    console.log("Se verificó el perfil de la empresa");
                    setIsPerfilIncompleto(data.isPerfilIncompleto);
                } catch (error) {
                    console.log("Usuario autenticado no es empresa o no tiene perfil de empresa");
                }
            }
        };
        fetchPerfilEmpresa();
    }, [id_usuario, id]);

    const isLoading = authLoading || loading;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {isLoading && <LoadingScreen />}
            <Navbar />
            
            <main className="flex-1 pt-24 pb-16">
                {error ? (
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <i className="fas fa-exclamation-circle text-red-500 text-4xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-red-800 mb-2">
                                Error al cargar el perfil
                            </h2>
                            <p className="text-red-700 mb-6">
                                {typeof error === 'string' 
                                    ? error 
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