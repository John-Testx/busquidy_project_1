import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/auth/useAuth'; // Importa tu hook de auth
import LoadingScreen from '@/components/LoadingScreen';

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { refetchUser } = useAuth(); // Usamos refresh para actualizar el estado

    const getRedirectPath = (tipoUsuario) => {
        if (tipoUsuario === 'freelancer') {
            return '/freelancer'; // Panel de Freelancer
        }
        if (tipoUsuario === 'empresa_juridico' || tipoUsuario === 'empresa_natural') {
            return '/empresa'; // Panel de Empresa
        }
        // Ruta por defecto si no hay tipo (o es admin, etc.)
        return '/'; 
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');
        const tipo_usuario = params.get('tipo_usuario'); // 👈 ¡LEEMOS EL TIPO DE USUARIO!

        if (token) {
            // Guarda toda la información de sesión
            sessionStorage.setItem("token", token);
            if (email) {
                sessionStorage.setItem("correo", email);
            }
            if (tipo_usuario) { 
                sessionStorage.setItem("tipo_usuario", tipo_usuario);
            }
            
            // Refresca el estado de autenticación del hook
            refetchUser(); 
            
            // Redirige al panel correcto
            const redirectPath = getRedirectPath(tipo_usuario);
            navigate(redirectPath);
            
        } else {
            // Falló, redirige al inicio
            navigate('/');
        }
    }, [location, navigate, refetchUser]); // Dependencias del useEffect

    return (
        <div>
            {loading && <LoadingScreen />}
        </div>
    );
};

export default AuthCallback;