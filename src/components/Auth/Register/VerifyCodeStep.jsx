import { Loader2, ArrowLeft } from "lucide-react";
import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// --- Step 2 Component: Verification Code ---
// (This is based on your EmailVerificationModal.jsx)
function VerifyCodeStep({ email, onCodeVerified, onBack }) {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${API_URL}/users/verify-email-code`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: email, codigo: code }),
            });
            console.log("Verifying code:", { email, code });
            
            if (!response.ok) {
                 // IMPORTANT FIX: Read response as text if not OK to catch HTML errors
                const errorText = await response.text();
                console.error("Server Error Response (VerifyCodeStep):", errorText);
                
                // Try to parse JSON data if it was sent, otherwise throw a generic error
                try {
                    const data = JSON.parse(errorText);
                    throw new Error(data.error || "Código incorrecto o expirado");
                } catch (parseError) {
                     // Generic server error message for user
                    throw new Error("Error del servidor. Inténtalo más tarde.");
                }
            }
            
            // Safe to parse JSON now
            const data = await response.json();

            setLoading(false);
            onCodeVerified(); // Success! Go to next step
        } catch (err) {
            setLoading(false);
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleVerifyCode} className="space-y-4 animate-[fadeIn_0.5s_ease-out] w-full">
            <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium mb-4">
                <ArrowLeft size={16} /> Volver
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Verifica tu correo</h2>
            <p className="text-gray-600 mb-6">Enviamos un código de 6 dígitos a <strong>{email}</strong>. Ingrésalo a continuación.</p>

            {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
            
            <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Verificación
                </label>
                <input 
                    type="text" 
                    id="codigo"
                    value={code}
                    onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setCode(value);
                            setError("");
                        }}
                    className={`w-full text-center tracking-[0.5em] font-bold text-lg p-2.5 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="123456"
                    maxLength={6}
                />
            </div>
            
            <button 
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-[#07767c] text-white rounded-xl font-semibold hover:bg-[#055a5f]"
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin" /> : "Verificar y Continuar"}
            </button>
        </form>
    );
};

export default VerifyCodeStep;

// Note: Need to use this VerifyCodeStep component
// and manage the step transitions accordingly.

// Right now the form for freelancer profiles work
// the same way with steps but the need of a lib like React Hook forms may be needed to manage the complexity.