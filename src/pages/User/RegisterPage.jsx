import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/Layouts/MainLayout';
import SecondaryRegisterModal from '@/components/Auth/Modals/SecondaryRegisterModal'; // Reusing this
import AuthHero from '@/components/Auth/AuthHero';
import RegisterForm from '@/components/Auth/RegisterForm';

const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="flex flex-col md:flex-row" style={{ minHeight: 'calc(100vh - 80px)' }}>
                {/* Left Panel */}
                <AuthHero />
                
                {/* Right Panel */}
                <div className="flex-1 p-12 flex flex-col justify-center bg-gray-50">
                    <div className="max-w-md mx-auto w-full">
                        
                        {/* The RegisterForm component handles its own 3 steps
                          (Email, Verify, Details) internally.
                        */}
                        <RegisterForm
                            onRegisterSuccess={() => {
                                // The form navigates to /login on success
                            }}
                            onOpenLogin={() => navigate('/login')}
                        />
                        
                        <p className="text-xs text-gray-500 text-center leading-relaxed mt-6">
                            Al registrarte, aceptas nuestros{' '}
                            <Link to="/terminos" className="text-[#07767c] hover:underline">Términos de servicio</Link>
                            {' '}y{' '}
                            <Link to="/privacidad" className="text-[#07767c] hover:underline">Política de privacidad</Link>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default RegisterPage;