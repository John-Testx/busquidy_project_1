import React, { useState } from "react";
import { Mail, Chrome, AlertCircle, Loader2 } from "lucide-react";
import { FaMicrosoft } from "react-icons/fa";
import { validateEmail } from "@/utils/authUtils";

const API_URL = import.meta.env.VITE_API_URL;

// --- Step 1 Component: Email Form ---
function EmailStep({ onEmailSubmitted, onOpenLogin, onBack }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email) return setError("El correo electrónico es obligatorio");
        if (!validateEmail(email)) return setError("Por favor, ingresa un correo electrónico válido");

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users/send-verification-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: email }),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar el código');
            }
            
            setLoading(false);
            onEmailSubmitted(email); // Success! Go to next step
        } catch (err) {
            setLoading(false);
            setError(err.message.includes("registrado") ? err.message : "Error del servidor. Inténtalo más tarde.");
        }
    };

    return (
        <div className="mb-8">
            
            <div className="space-y-3">
            {/* Google Button */}
            <a 
                href={`${API_URL}/users/auth/google`}
                className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
            >
                <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform duration-200" />
                <span>Continuar con Google</span>
            </a>

            {/* Microsoft Button */}
            <a 
                href={`${API_URL}/users/auth/microsoft`}
                className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
            >
                <FaMicrosoft size={20} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                <span>Continuar con Microsoft</span>
            </a>

        {/* Divider */}
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500 font-medium">O</span>
            </div>
        </div>

        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4 animate-[fadeIn_0.5s_ease-out] w-full">
            {onBack && (
                <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium mb-4">
                    <ArrowLeft size={16} /> Volver
                </button>
            )}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Crea tu cuenta</h2>
            <p className="text-gray-600 mb-6">Ingresa tu correo para comenzar.</p>

            {error && (
                <div className="flex items-center p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
            
            <div>
                <label htmlFor="correo-reg" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                </label>
                <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="email" 
                        id="correo-reg"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-[#07767c]'}`}
                        placeholder="tu@correo.com"
                    />
                </div>
            </div>

            <button 
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-[#07767c] text-white rounded-xl font-semibold hover:bg-[#055a5f] focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md group transform hover:-translate-y-0.5"
                disabled={loading}
            >
                {loading ? (
                    <><Loader2 size={20} className="animate-spin" /><span>Enviando código...</span></>
                ) : (
                    <><Mail size={20} /><span>Continuar con Correo</span></>
                )}
            </button>
            
            <p className="text-center text-gray-600 mt-6">
                ¿Ya tienes una cuenta?{' '}
                <button type="button" onClick={onOpenLogin} className="text-[#07767c] hover:text-[#055a5f] font-semibold">
                    Inicia sesión
                </button>
            </p>
        </form>
        </div>
    );
};

export default EmailStep;