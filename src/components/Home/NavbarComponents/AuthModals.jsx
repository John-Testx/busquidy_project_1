import React, { useState } from "react";
import LoginModal from "@/components/Auth/Modals/LoginModal";
import LoginSecondaryModal from "@/components/Auth/Modals/LoginSecondaryModal";
import RegisterModal from "@/components/Auth/Modals/RegisterModal";
import EmailVerificationModal from "@/components/Auth/Modals/EmailVerificationModal";
import SecondaryRegisterModal from "@/components/Auth/Modals/SecondaryRegisterModal";

const AuthModals = ({ 
    showLoginModal, 
    setShowLoginModal, 
    showRegisterModal, 
    setShowRegisterModal, 
    auth 
}) => {
    const { handleLogin, handleRegister, errors, loading } = auth;
    
    // Internal state for modal navigation and form data
    const [showLoginSecondaryModal, setShowLoginSecondaryModal] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [showSecondaryRegisterModal, setShowSecondaryRegisterModal] = useState(false);
    
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const [loginFormData, setLoginFormData] = useState({ correo: '', contraseña: '' });
    const [registerFormData, setRegisterFormData] = useState({
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
        tipoUsuario: ''
    });

    // Handlers
    const updateLoginFormData = (field, value) => setLoginFormData(prev => ({ ...prev, [field]: value }));
    const updateRegisterFormData = (field, value) => setRegisterFormData(prev => ({ ...prev, [field]: value }));
    
    const clearLoginForm = () => setLoginFormData({ correo: '', contraseña: '' });
    const clearRegisterForm = () => {
        setRegisterFormData({ correo: '', contraseña: '', confirmarContraseña: '', tipoUsuario: '' });
        setVerifiedEmail('');
    };

    const onLoginSuccess = (tipoUsuario) => {
        setShowLoginSecondaryModal(false);
        setShowLoginModal(false);
        clearLoginForm();
        auth.onLoginSuccess(tipoUsuario); // Trigger navigation in parent
    };

    const handleLoginSubmit = async () => {
        await handleLogin(loginFormData.correo, loginFormData.contraseña, onLoginSuccess);
    };

    const handleRegisterSubmit = async () => {
        if (registerFormData.contraseña !== registerFormData.confirmarContraseña) {
            alert('Las contraseñas no coinciden');
            return;
        }
        await handleRegister(verifiedEmail, registerFormData.contraseña, registerFormData.tipoUsuario, () => {
            setShowSecondaryRegisterModal(false);
            clearRegisterForm();
        });
    };

    const handleEmailVerified = (email) => {
        setVerifiedEmail(email);
        setShowEmailVerification(false);
        setShowSecondaryRegisterModal(true);
    };

    return (
        <>
            {showLoginModal && (
                <LoginModal
                    onClose={() => { setShowLoginModal(false); clearLoginForm(); }}
                    onOpenSecondary={() => { setShowLoginModal(false); setShowLoginSecondaryModal(true); }}
                    onOpenRegister={() => { setShowLoginModal(false); clearLoginForm(); setShowRegisterModal(true); }}
                />
            )}

            {showLoginSecondaryModal && (
                <LoginSecondaryModal
                    onClose={() => { setShowLoginSecondaryModal(false); clearLoginForm(); }}
                    onBack={() => { setShowLoginSecondaryModal(false); setShowLoginModal(true); }}
                    formData={loginFormData}
                    setFormData={updateLoginFormData}
                    errors={errors}
                    handleLogin={handleLoginSubmit}
                    loading={loading}
                    onOpenRegister={() => { setShowLoginSecondaryModal(false); clearLoginForm(); setShowRegisterModal(true); }}
                />
            )}

            {showRegisterModal && (
                <RegisterModal
                    onClose={() => { setShowRegisterModal(false); clearRegisterForm(); }}
                    onOpenSecondary={() => { setShowRegisterModal(false); setShowSecondaryRegisterModal(true); }}
                    onOpenLogin={() => { setShowRegisterModal(false); clearRegisterForm(); setShowLoginModal(true); }}
                    onOpenEmailVerification={(email) => { setVerifiedEmail(email); setShowRegisterModal(false); setShowEmailVerification(true); }}
                />
            )}

            {showEmailVerification && (
                <EmailVerificationModal
                    onClose={() => { setShowEmailVerification(false); clearRegisterForm(); }}
                    onBack={() => { setShowEmailVerification(false); setShowRegisterModal(true); }}
                    email={verifiedEmail}
                    onVerified={handleEmailVerified}
                />
            )}

            {showSecondaryRegisterModal && (
                <SecondaryRegisterModal
                    onClose={() => { setShowSecondaryRegisterModal(false); clearRegisterForm(); }}
                    onBack={() => { setShowSecondaryRegisterModal(false); setShowEmailVerification(true); }}
                    formData={registerFormData}
                    setFormData={updateRegisterFormData}
                    handleRegister={handleRegisterSubmit}
                    errors={errors}
                    loading={loading}
                    onOpenLogin={() => { setShowSecondaryRegisterModal(false); clearRegisterForm(); setShowLoginModal(true); }}
                    verifiedEmail={verifiedEmail}
                />
            )}
        </>
    );
};

export default AuthModals;