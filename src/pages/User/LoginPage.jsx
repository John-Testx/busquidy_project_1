import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Chrome, ArrowLeft } from 'lucide-react';
import { FaMicrosoft } from 'react-icons/fa';
import AuthHero from '@/components/Auth/AuthHero';
import MainLayout from '@/components/Layouts/MainLayout';
import LoginForm from '@/components/Auth/LoginForm';

const API_URL = import.meta.env.VITE_API_URL;

// This is the component for Step 1 (OAuth/Primary)
const PrimaryLoginOptions = ({ onOpenSecondary, onOpenRegister }) => (
    <div className="flex-1 p-12 flex flex-col justify-center bg-gray-50">
        <div className="max-w-md mx-auto w-full space-y-6">
            <div className="animate-[fadeIn_0.4s_ease-out]">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Inicia sesión
                </h2>
                <p className="text-gray-600 mb-8">
                    ¿No tienes una cuenta?{' '}
                    <button 
                        onClick={onOpenRegister} 
                        className="text-[#07767c] hover:text-[#055a5f] font-semibold transition-colors duration-200"
                    >
                        Regístrate aquí
                    </button>
                </p>
            </div>

            <div className="space-y-3">
                <a 
                    href={`${API_URL}/users/auth/google`}
                    className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
                >
                    <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform duration-200" />
                    <span>Continuar con Google</span>
                </a>
                <a 
                    href={`${API_URL}/users/auth/microsoft`}
                    className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
                >
                    <FaMicrosoft size={20} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                    <span>Continuar con Microsoft</span>
                </a>
            </div>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-gray-50 text-gray-500 font-medium">O</span></div>
            </div>

            <button 
                className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-[#07767c] hover:bg-[#07767c]/5 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
                onClick={onOpenSecondary}
            >
                <Mail size={20} className="text-[#07767c] group-hover:scale-110 transition-transform duration-200" />
                <span>Continuar con Correo Electrónico</span>
            </button>

            <p className="text-xs text-gray-500 text-center leading-relaxed mt-6">
                Al unirte, aceptas nuestros{' '}
                <Link to="/terminos" className="text-[#07767c] hover:underline">Términos de servicio</Link>
                {' '}y{' '}
                <Link to="/privacidad" className="text-[#07767c] hover:underline">Política de privacidad</Link>
            </p>
        </div>
    </div>
);

const LoginPage = () => {
    // This state controls which component is shown on the right panel
    const [step, setStep] = useState('primary'); // 'primary' or 'secondary'
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="flex flex-col md:flex-row" style={{ minHeight: 'calc(100vh - 80px)' }}>
                {/* Left Panel */}
                <AuthHero />
                
                {/* Right Panel */}
                <div className="flex-1 p-12 flex flex-col justify-center bg-gray-50">
                    <div className="max-w-md mx-auto w-full">
                        
                        {/* Show OAuth options */}
                        {step === 'primary' && (
                            <PrimaryLoginOptions 
                                onOpenSecondary={() => setStep('secondary')}
                                onOpenRegister={() => navigate('/register')}
                            />
                        )}
                        
                        {/* Show Email/Pass form */}
                        {step === 'secondary' && (
                            <LoginForm
                                onLoginSuccess={() => {
                                    // The form itself handles navigation, so nothing to do here!
                                }}
                                onOpenRegister={() => navigate('/register')}
                                onBack={() => setStep('primary')} // Pass the 'onBack' prop
                            />
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LoginPage;