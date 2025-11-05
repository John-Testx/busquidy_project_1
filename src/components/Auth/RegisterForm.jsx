import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks";
import { FaMicrosoft } from "react-icons/fa";
import { Mail, Lock, Chrome, AlertCircle, Loader2, User, Briefcase, Building2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { validateEmail } from "@/utils/authUtils";

// Steps components
import EmailStep from "./Register/EmailStep";
import VerifyCodeStep from "./Register/VerifyCodeStep";

const API_URL = import.meta.env.VITE_API_URL;


// --- Step 3 Component: Details Form (Password & User Type) ---
const DetailsStep = ({ email, onRegisterSuccess, onBack, onOpenLogin }) => {
    const [formData, setFormData] = useState({
        contraseña: "",
        confirmPassword: "",
        tipoUsuario: "freelancer"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // This form calls the main useAuth hook for the final step
    const { handleRegister, loading, errors, clearMessage } = useAuth();

    const userTypes = [
        { value: "freelancer", label: "Freelancer", icon: User, detail: "Estudiante o profesional" },
        { value: "empresa_juridico", label: "Empresa Jurídica", icon: Building2, detail: "Empresa con RUT jurídico" },
        { value: "empresa_natural", label: "Empresa Natural", icon: Briefcase, detail: "Emprendedor con RUT natural" },
    ];
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        clearMessage();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simple client-side validation
        if (formData.contraseña !== formData.confirmPassword) {
            // You can use the `errors` state from useAuth, but this is quicker
            alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }
        
        await handleRegister(
            email, 
            formData.contraseña, 
            formData.tipoUsuario,
            onRegisterSuccess // This is the onSuccess callback from useAuth
        );
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-[fadeIn_0.5s_ease-out] w-full">
            <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium mb-4">
                <ArrowLeft size={16} /> Volver
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Completa tu perfil</h2>
            <p className="text-gray-600 mb-6">Correo verificado: <strong>{email}</strong></p>

            {/* User Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona tu tipo de cuenta</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {userTypes.map((type) => (
                        <label key={type.value} className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.tipoUsuario === type.value ? 'border-[#07767c] bg-[#07767c]/5 shadow-lg' : 'border-gray-300 bg-white hover:border-gray-400'}`}>
                            <input 
                                type="radio" 
                                name="tipoUsuario" 
                                value={type.value} 
                                checked={formData.tipoUsuario === type.value}
                                onChange={handleChange}
                                className="absolute opacity-0"
                            />
                            <type.icon size={24} className={`mb-2 ${formData.tipoUsuario === type.value ? 'text-[#07767c]' : 'text-gray-500'}`} />
                            <span className="font-semibold text-sm">{type.label}</span>
                            <span className="text-xs text-gray-500">{type.detail}</span>
                        </label>
                    ))}
                </div>
                {errors.tipoUsuario && <p className="text-red-600 text-xs mt-1">{errors.tipoUsuario}</p>}
            </div>

            {/* Password Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crea una Contraseña</label>
                <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-2.5 border rounded-lg ${errors.contraseña ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.contraseña && <p className="text-red-600 text-xs mt-1">{errors.contraseña}</p>}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg"
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-[#07767c] text-white rounded-xl font-semibold hover:bg-[#055a5f]"
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin" /> : "Crear mi cuenta"}
            </button>
            
            <p className="text-center text-gray-600 mt-4 text-sm">
                ¿Ya tienes una cuenta?{' '}
                <button type="button" onClick={onOpenLogin} className="text-[#07767c] hover:text-[#055a5f] font-semibold">
                    Iniciar sesión
                </button>
            </p>
        </form>
    );
};

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

    if (step === 'email') {
        return <EmailStep 
            onEmailSubmitted={handleEmailSubmitted} 
            onOpenLogin={onOpenLogin}
            onBack={onBack}
        />;
    }
    
    if (step === 'verify') {
        return <VerifyCodeStep 
            email={verifiedEmail} 
            onCodeVerified={handleCodeVerified} 
            onBack={handleBack} 
        />;
    }
    
    if (step === 'details') {
        return <DetailsStep 
            email={verifiedEmail} 
            onRegisterSuccess={handleRegisterSuccess} 
            onBack={handleBack}
            onOpenLogin={onOpenLogin}
        />;
    }
    
    return null; // Should not happen
};

export default RegisterForm;