import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import apiClient from '@/api/apiClient';
import useAuth from '@/hooks/auth/useAuth';
import { Briefcase, Building, User, CheckCircle2, Loader2 } from 'lucide-react';

const CompleteProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { refetchUser } = useAuth();
    
    const [tempToken, setTempToken] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setProfile(decoded);
                setTempToken(token);
            } catch (e) {
                setError('Token inválido o expirado.');
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [location, navigate]);

    const handleSelectType = async (tipoUsuario) => {
        if (!tempToken) return;
        
        setSelectedType(tipoUsuario);
        setLoading(true);
        setError('');
        
        try {
            // Llama al nuevo endpoint
            const response = await apiClient.post(
                '/users/auth/complete-social-register', 
                { tipo_usuario: tipoUsuario },
                { headers: { 'Authorization': `Bearer ${tempToken}` } }
            );

            // ¡Éxito! Guarda el token FINAL
            const { token: finalToken, tipo_usuario } = response.data;
            sessionStorage.setItem("token", finalToken);
            sessionStorage.setItem("correo", profile.email);
            sessionStorage.setItem("tipo_usuario", tipo_usuario);

            refetchUser();
            // 👇 Redirigimos dinámicamente
            if (tipo_usuario === 'freelancer') {
                navigate('/freelancer');
            } else {
                navigate('/empresa');
            }

        } catch (err) {
            setLoading(false);
            setSelectedType(null);
            setError(err.response?.data?.error || 'Error al completar el registro.');
        }
    };

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-[#07767c] animate-spin" />
                    <p className="text-gray-600 font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    const options = [
        {
            type: 'freelancer',
            title: 'Estudiante',
            description: 'Ofrece tus servicios profesionales',
            icon: User,
            color: 'from-[#07767c] to-[#055a5f]',
            hoverColor: 'hover:shadow-[#07767c]/20'
        },
        {
            type: 'empresa_juridico',
            title: 'Empresa Jurídica',
            description: 'Contrata profesionales para tu empresa',
            icon: Building,
            color: 'from-gray-700 to-gray-900',
            hoverColor: 'hover:shadow-gray-700/20'
        },
        {
            type: 'empresa_natural',
            title: 'Empresa Natural',
            description: 'Gestiona proyectos como persona natural',
            icon: Briefcase,
            color: 'from-indigo-600 to-indigo-800',
            hoverColor: 'hover:shadow-indigo-600/20'
        }
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-50 p-4">
            <div className="w-full max-w-2xl">
                {/* Header con animación */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-full mb-6 shadow-lg">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        ¡Bienvenido, <span className="text-[#07767c]">{profile.nombre}</span>!
                    </h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                        Solo un paso más. Selecciona cómo usarás <span className="font-semibold text-[#07767c]">Busquidy</span>
                    </p>
                </div>

                {/* Opciones de tipo de usuario */}
                <div className="space-y-4 mb-6">
                    {options.map((option, index) => {
                        const Icon = option.icon;
                        const isSelected = selectedType === option.type;
                        const isLoading = loading && isSelected;
                        
                        return (
                            <button
                                key={option.type}
                                onClick={() => handleSelectType(option.type)}
                                disabled={loading}
                                className={`
                                    w-full p-6 rounded-2xl transition-all duration-300 
                                    bg-white border-2 
                                    ${isSelected 
                                        ? 'border-[#07767c] shadow-xl scale-[1.02]' 
                                        : 'border-gray-200 hover:border-[#07767c] hover:shadow-lg'
                                    }
                                    ${loading && !isSelected ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
                                    ${option.hoverColor}
                                    disabled:cursor-not-allowed
                                    group
                                `}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'slideUp 0.5s ease-out forwards'
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icono */}
                                    <div className={`
                                        flex-shrink-0 w-16 h-16 rounded-xl 
                                        bg-gradient-to-br ${option.color}
                                        flex items-center justify-center
                                        shadow-lg group-hover:scale-110 transition-transform duration-300
                                    `}>
                                        {isLoading ? (
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        ) : (
                                            <Icon className="w-8 h-8 text-white" />
                                        )}
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 text-left">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#07767c] transition-colors">
                                            {option.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {option.description}
                                        </p>
                                    </div>

                                    {/* Indicador de selección */}
                                    {isSelected && (
                                        <div className="flex-shrink-0">
                                            <CheckCircle2 className="w-6 h-6 text-[#07767c] animate-scale-in" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Footer informativo */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        ¿Tienes dudas? <a href="/soportehome" className="text-[#07767c] hover:underline font-medium">Contáctanos</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;