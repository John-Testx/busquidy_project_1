import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';
import LoadingScreen from '@/components/LoadingScreen';
import ProfileSidebar from '@/components/Empresa/Perfil/ProfileSidebar';
import { Footer, Navbar } from '@/components/Home/';

// 1. Import the new API functions
import { getEmpresaProfile, updateEmpresaProfile, checkEmpresaProfileStatus } from '@api/empresaApi';
import CreatePerfilEmpresa from '@/components/Empresa/Perfil/CreatePerfilEmpresa';

function EmpresaProfileLayout() {
    const { tipo_usuario, id_usuario, loading: authLoading } = useAuth();
    const [perfilData, setPerfilData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);

    // 2. Función unificada para verificar y cargar el perfil
    const checkAndLoadProfile = useCallback(async () => {
        if (!id_usuario) return;
        
        console.log("userType while checking", tipo_usuario);

        setIsLoading(true);
        try {
            // Primero, solo verificamos el estado del perfil
            const statusData = await checkEmpresaProfileStatus(id_usuario);
            console.log("Estado del perfil verificado:", statusData);
            setIsPerfilIncompleto(statusData.isPerfilIncompleto);
            // console.log("Perfil incompleto: ",tipo_usuario );

            // Si el perfil NO está incompleto, cargamos los datos completos
            if (statusData.isPerfilIncompleto === false) {
                console.log("El perfil está completo. Cargando datos...");
                const data = await getEmpresaProfile(id_usuario);
                setPerfilData(data);
            }
        } catch (error) {
            console.error("Error al verificar o cargar el perfil:", error);
            toast.error("Hubo un problema al cargar tu perfil.");
            // En caso de error (ej: 404), asumimos que el perfil es incompleto para que pueda crearlo
            setIsPerfilIncompleto(true);
        } finally {
            setIsLoading(false);
        }
    }, [id_usuario]);

    useEffect(() => {
        if (!authLoading && id_usuario) {
            checkAndLoadProfile();
        } else if (!authLoading) {
            setIsLoading(false); // Detener la carga si no hay usuario
        }
    }, [id_usuario, authLoading, checkAndLoadProfile]);

    // 4. Create the centralized update handler
    const handleUpdateProfile = async () => {
        if (!perfilData) {
        toast.error("No hay datos de perfil para guardar.");
        return;
        }
        try {
        await updateEmpresaProfile(id_usuario, perfilData);
        toast.success("Perfil actualizado exitosamente.");
        await checkAndLoadProfile(); // Recarga todos los datos para confirmar cambios
        } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error al guardar los cambios.");
        }
    };

    if (isLoading || authLoading) {
        return <LoadingScreen />;
    }

    // 3. La lógica de renderizado ahora funciona como se esperaba
    return (
        <div>
            <Navbar />
            <div className="flex-grow">
                {isPerfilIncompleto === null ? (
                    <div className="w-full flex justify-center items-center min-h-[60vh]">
                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="animate-spin">
                                    <i className="fas fa-spinner text-4xl text-teal-600"></i>
                                </div>
                            </div>
                            <p className="text-gray-600 text-lg">
                                Verificando perfil...
                            </p>
                        </div>
                    </div>
                ) : isPerfilIncompleto ? (
                    // Pasamos la función para que el componente hijo pueda recargar el layout después de crear el perfil
                    <CreatePerfilEmpresa 
                        id_usuario={id_usuario}
                        userType={tipo_usuario} 
                        onProfileCreated={checkAndLoadProfile} 
                    />
                ) : (
                    <>
                        <div className="flex pt-10 mt-20 gap-6 max-w-7xl mx-auto py-8 px-4 min-h-[60vh]">
                            <ProfileSidebar />
                            <main className="flex-1">
                                <Outlet context={{ perfilData, setPerfilData, id_usuario, handleUpdateProfile }} />
                            </main>
                        </div>
                    </>
                )}
            </div>
            
            <Footer />
        
        </div>
    );
}

export default EmpresaProfileLayout;

// // Custom hook to easily access the context in child components
// export function useProfileData() {
//   return useOutletContext();
// }