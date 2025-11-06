import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks"; // Using jsconfig.json path
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";

/**
 * This is a self-contained login form.
 * It manages its own state and calls useAuth directly.
 *
 * @param {object} props
 * @param {function} props.onLoginSuccess - (Optional) Callback after login.
 * @param {function} props.onOpenRegister - Callback to switch to register flow.
 * @param {function} [props.onBack] - (Optional) Callback to show a "Back" button.
 */
const LoginForm = ({ onLoginSuccess, onOpenRegister, onBack }) => {
    const [formData, setFormData] = useState({ correo: "", contraseña: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // This component now "owns" its auth logic by calling the hook itself.
    const { handleLogin, loading, errors, clearMessage } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear errors from useAuth when the user starts typing
        if (errors.correo || errors.contraseña) {
            clearMessage();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // This is the callback to run after useAuth().handleLogin succeeds
        const navigateToDashboard = (tipo_usuario) => {
            // If a success callback was passed (e.g., to close a modal), run it.
            if (onLoginSuccess) onLoginSuccess(); 
            
            // Navigate to the correct dashboard
            if (tipo_usuario === 'administrador') {
                navigate('/adminhome');
            } else if (tipo_usuario === 'freelancer') {
                navigate('/freelancer');
            } else {
                navigate('/empresa');
            }
        };
        
        // Call the login function from the hook
        await handleLogin(formData.correo, formData.contraseña, navigateToDashboard);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-[fadeIn_0.5s_ease-out] w-full">
            {/* Show a "Back" button ONLY if the onBack prop is provided */}
            {onBack && (
                <button 
                    type="button"
                    onClick={onBack} 
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors duration-200"
                >
                    <ArrowLeft size={16} />
                    Volver
                </button>
            )}

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Iniciar sesión
            </h2>
            <p className="text-gray-600 mb-6">
                Ingresa tu correo y contraseña.
            </p>

            {/* Email Input */}
            <div>
                <label htmlFor="correo-login" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                </label>
                <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="email" 
                        id="correo-login"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.correo ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-[#07767c]'}`}
                        placeholder="tu@correo.com"
                    />
                </div>
                {errors.correo && <p className="flex items-center mt-1.5 text-xs text-red-600"><AlertCircle size={14} className="mr-1" /> {errors.correo}</p>}
            </div>

            {/* Password Input */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="contraseña-login" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <a href="/forgot-password" className="text-xs text-[#07767c] hover:underline font-medium">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
                <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        id="contraseña-login"
                        name="contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.contraseña ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-[#07767c]'}`}
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.contraseña && <p className="flex items-center mt-1.5 text-xs text-red-600"><AlertCircle size={14} className="mr-1" /> {errors.contraseña}</p>}
            </div>
            
            {/* Submit Button */}
            <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-[#07767c] text-white rounded-xl font-semibold hover:bg-[#055a5f] focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
                disabled={loading}
            >
                {loading ? (
                    <><Loader2 size={20} className="animate-spin" /><span>Iniciando sesión...</span></>
                ) : (
                    <><span>Iniciar sesión</span><ArrowLeft size={20} className="rotate-180 group-hover:translate-x-1 transition-transform duration-200" /></>
                )}
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-600 mt-6">
                ¿No tienes una cuenta?{' '}
                <button type="button" onClick={onOpenRegister} className="text-[#07767c] hover:text-[#055a5f] font-semibold">
                    Regístrate
                </button>
            </p>
        </form>
    );
};

export default LoginForm;