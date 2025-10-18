import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../../components/LoadingScreen';
import ProfileSidebar from '../../components/Empresa/Perfil/ProfileSidebar';
import Navbar from '@/components/Home/Navbar';
import Footer from '@/components/Home/Footer';

// 1. Import the new API functions
import { getEmpresaProfile, updateEmpresaProfile } from '@api/companyApi'; // Adjust path if needed

function EmpresaProfileLayout() {
    const { userType, id_usuario, loading: authLoading } = useAuth();
    const [perfilData, setPerfilData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadPerfil = useCallback(async () => {
        if (!id_usuario) return;
        setIsLoading(true);
        try {
        // 3. Use the new API function
        const data = await getEmpresaProfile(id_usuario);
        setPerfilData(data);
        } catch (error) {
        console.error("Error cargando perfil:", error);
        toast.error("Error al cargar el perfil de la empresa.");
        } finally {
        setIsLoading(false);
        }
    }, [id_usuario]);

    useEffect(() => {
        if (!authLoading) {
        loadPerfil();
        }
    }, [id_usuario, authLoading, loadPerfil]);

    // 4. Create the centralized update handler
    const handleUpdateProfile = async () => {
        if (!perfilData) {
        toast.error("No hay datos de perfil para guardar.");
        return;
        }
        try {
        await updateEmpresaProfile(id_usuario, perfilData);
        toast.success("Perfil actualizado exitosamente.");
        await loadPerfil(); // Reload data to confirm changes
        } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error al guardar los cambios.");
        }
    };

    if (isLoading || authLoading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <Navbar/>
            <div className="flex pt-10 mt-20 gap-6 max-w-7xl mx-auto py-8 px-4">
                <ProfileSidebar />
                <main className="flex-1">
                    {/* The Outlet renders the active section component (e.g., EmpresaInfo) */}
                    {/* We pass the data and the setter function down through the context */}
                    <Outlet context={{ perfilData, setPerfilData, id_usuario, handleUpdateProfile }} />
                </main>
                
            </div>
            <Footer/>
        </div>
    );
}

export default EmpresaProfileLayout;

// // Custom hook to easily access the context in child components
// export function useProfileData() {
//   return useOutletContext();
// }