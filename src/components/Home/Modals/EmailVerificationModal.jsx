import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { ArrowLeft, Mail, AlertCircle, Loader2, CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const EmailVerificationModal = ({ onClose, onBack, email, onVerified }) => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutos en segundos
    const [canResend, setCanResend] = useState(false);

    // Temporizador de expiración
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerifyCode = async () => {
        setError("");
        
        if (!code || code.length !== 6) {
            setError("Por favor, ingresa el código de 6 dígitos");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/users/verify-email-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: email, codigo: code }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Código incorrecto o expirado');
            }

            // Código verificado correctamente
            onVerified(email);
            
        } catch (err) {
            setError(err.message || 'Error al verificar el código');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setError("");
        setResending(true);

        try {
            const response = await fetch(`${API_URL}/users/send-verification-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al reenviar código');
            }

            setTimeLeft(600); // Reiniciar timer a 10 minutos
            setCanResend(false);
            setCode(""); // Limpiar código anterior
            
        } catch (err) {
            setError(err.message || 'Error al reenviar el código');
        } finally {
            setResending(false);
        }
    };

    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={false} size="md">
            <div className="p-8 bg-white rounded-2xl">
                {/* Back Button */}
                <button 
                    type="button" 
                    className="flex items-center gap-2 text-gray-600 hover:text-[#07767c] transition-all duration-200 mb-6 group"
                    onClick={onBack}
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">Volver</span>
                </button>

                {/* Icon */}
                <div className="w-16 h-16 bg-[#07767c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-[#07767c]" />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Verifica tu correo
                </h2>
                
                <p className="text-gray-600 mb-6 text-center">
                    Hemos enviado un código de verificación a:<br />
                    <strong className="text-[#07767c]">{email}</strong>
                </p>

                {/* Code Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                        Ingresa el código de 6 dígitos
                    </label>
                    <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={code}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setCode(value);
                            setError("");
                        }}
                        className={`w-full px-4 py-4 text-center text-2xl font-bold tracking-widest bg-white border-2 rounded-xl transition-all duration-200 outline-none ${
                            error 
                                ? 'border-red-500 focus:border-red-600' 
                                : 'border-gray-200 focus:border-[#07767c] focus:shadow-md'
                        }`}
                        disabled={loading}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                            <AlertCircle size={16} />
                            {error}
                        </p>
                    )}
                </div>

                {/* Timer */}
                <div className="mb-6 text-center">
                    {timeLeft > 0 ? (
                        <p className="text-sm text-gray-500">
                            ⏱️ El código expira en: <strong className="text-[#07767c]">{formatTime(timeLeft)}</strong>
                        </p>
                    ) : (
                        <p className="text-sm text-red-500">
                            ⚠️ El código ha expirado. Solicita uno nuevo.
                        </p>
                    )}
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerifyCode}
                    disabled={loading || code.length !== 6}
                    className="w-full bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-[#055a5f] hover:to-[#043d42] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transform hover:-translate-y-0.5 mb-4"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Verificando...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={20} className="group-hover:scale-110 transition-transform duration-200" />
                            <span>Verificar código</span>
                        </>
                    )}
                </button>

                {/* Resend Button */}
                <button
                    onClick={handleResendCode}
                    disabled={resending || !canResend}
                    className="w-full text-[#07767c] hover:text-[#055a5f] font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {resending ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
                </button>

                {/* Help Text */}
                <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>Tip:</strong> Revisa tu bandeja de spam si no ves el correo en los próximos minutos.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default EmailVerificationModal;