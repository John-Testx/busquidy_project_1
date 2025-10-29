import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';
import LoadingScreen from '@/components/LoadingScreen';
import ProfileSidebar from '@/components/Empresa/Perfil/ProfileSidebar';
import { Footer, Navbar } from '@/components/Home/';
import { getEmpresaProfile, updateEmpresaProfile, checkEmpresaProfileStatus } from '@api/empresaApi';
import CreatePerfilEmpresa from '@/components/Empresa/Perfil/CreatePerfilEmpresa';

function EmpresaProfileLayout() {
    const { tipo_usuario, id_usuario, loading: authLoading } = useAuth();
    const [perfilData, setPerfilData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);

    const checkAndLoadProfile = useCallback(async () => {
        if (!id_usuario) return;
        
        console.log("userType while checking", tipo_usuario);

        setIsLoading(true);
        try {
            const statusData = await checkEmpresaProfileStatus(id_usuario);
            console.log("Estado del perfil verificado:", statusData);
            setIsPerfilIncompleto(statusData.isPerfilIncompleto);

            if (statusData.isPerfilIncompleto === false) {
                console.log("El perfil está completo. Cargando datos...");
                const data = await getEmpresaProfile(id_usuario);
                setPerfilData(data);
            }
        } catch (error) {
            console.error("Error al verificar o cargar el perfil:", error);
            toast.error("Hubo un problema al cargar tu perfil.");
            setIsPerfilIncompleto(true);
        } finally {
            setIsLoading(false);
        }
    }, [id_usuario, tipo_usuario]);

    useEffect(() => {
        if (!authLoading && id_usuario) {
            checkAndLoadProfile();
        } else if (!authLoading) {
            setIsLoading(false);
        }
    }, [id_usuario, authLoading, checkAndLoadProfile]);

    const handleUpdateProfile = async () => {
        if (!perfilData) {
            toast.error("No hay datos de perfil para guardar.");
            return;
        }
        try {
            await updateEmpresaProfile(id_usuario, perfilData);
            toast.success("Perfil actualizado exitosamente.");
            await checkAndLoadProfile();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error al guardar los cambios.");
        }
    };

    if (isLoading || authLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <Navbar />
            
            <div className="flex-grow pt-20">
                {isPerfilIncompleto === null ? (
                    <div className="w-full flex justify-center items-center min-h-[60vh]">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 border-4 border-[#07767c] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-gray-700 text-lg font-semibold">
                                Verificando perfil...
                            </p>
                        </div>
                    </div>
                ) : isPerfilIncompleto ? (
                    <CreatePerfilEmpresa 
                        id_usuario={id_usuario}
                        userType={tipo_usuario} 
                        onProfileCreated={checkAndLoadProfile} 
                    />
                ) : (
                    <div className="max-w-7xl mx-auto py-8 px-4 min-h-[60vh]">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Perfil de Empresa</h1>
                                    <p className="text-gray-600">Gestiona la información de tu organización</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6">
                            <ProfileSidebar />
                            <main className="flex-1">
                                <Outlet context={{ perfilData, setPerfilData, id_usuario, handleUpdateProfile }} />
                            </main>
                        </div>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}

export default EmpresaProfileLayout;