import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

// Steps components
import EmailStep from "./Register/EmailStep";
import VerifyCodeStep from "./Register/VerifyCodeStep";
import DetailsStep from "./Register/DetailsStep";

/**
 * This is the main "smart" component that manages the 3-step registration flow.
 *
 * @param {object} props
 * @param {function} props.onRegisterSuccess - (Optional) Callback after registration.
 * @param {function} props.onOpenLogin - Callback to switch to login flow.
 * @param {function} [props.onBack] - (Optional) Callback for the first step's Back button.
 */
const RegisterForm = ({ onRegisterSuccess, onOpenLogin, onBack }) => {
    const [step, setStep] = useState('email'); // 'email', 'verify', 'details'
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmitted = (email) => {
        setVerifiedEmail(email);
        setStep('verify');
    };

    const handleCodeVerified = () => {
        setStep('details');
    };
    
    // This is the final success callback for handleRegister
    const handleRegisterSuccess = () => {
        // Run the prop if provided (e.g., close modal)
        if (onRegisterSuccess) onRegisterSuccess();
        
        // After registering, send them to the login page
        navigate('/login');
    };

    const handleBack = () => {
        if (step === 'verify') setStep('email');
        else if (step === 'details') setStep('verify');
        else if (step === 'email' && onBack) onBack(); // Go back from the whole component
    };

    // Render the correct step component based on the current state
    switch (step) {
        case 'email':
            return <EmailStep 
                onEmailSubmitted={handleEmailSubmitted} 
                onOpenLogin={onOpenLogin}
                onBack={onBack} // Pass the onBack prop
            />;
        case 'verify':
            return <VerifyCodeStep 
                email={verifiedEmail} 
                onCodeVerified={handleCodeVerified} 
                onBack={handleBack} 
            />;
        case 'details':
            return <DetailsStep 
                email={verifiedEmail} 
                onRegisterSuccess={handleRegisterSuccess} 
                onBack={handleBack}
                onOpenLogin={onOpenLogin}
            />;
        default:
            return null;
    }
};

export default RegisterForm;