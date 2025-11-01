import React, { useState } from "react";
import { Mail, ArrowRight, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { sendSupportCode, verifySupportCode } from "../../api/supportApi"; // <--- AÑADIR

function EmailVerification({ onEmailVerified }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // Estado para el código
  const [emailSent, setEmailSent] = useState(false); // Controla la UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);
    
    // Guardar email en sessionStorage
    sessionStorage.setItem("guest_email", email);
    
    // Llamar al callback con el email
    onEmailVerified(email);
    
    setIsLoading(false);
  };

  // Maneja el envío del email (AHORA ES REAL)
const handleSendCode = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !email.includes("@")) {
    setError("Por favor ingresa un email válido");
    return;
  }

  setIsLoading(true);

  try {
    // Llamada real a la API
    await sendSupportCode(email);

    setIsLoading(false);
    setEmailSent(true); // Mostrar el campo de código
    setError(""); // Limpiar errores

  } catch (apiError) {
    setIsLoading(false);
    setError(apiError.response?.data?.error || "Error al enviar el código. Intenta de nuevo.");
  }
};

// Maneja la verificación del código (AHORA ES REAL)
const handleVerifyCode = async (e) => {
  e.preventDefault();
  setError("");

  if (!code.trim()) {
    setError("Por favor ingresa el código de verificación");
    return;
  }

  setIsLoading(true);

  try {
    // Llamada real a la API
    const response = await verifySupportCode(email, code);

    // Guardar email en sessionStorage
    sessionStorage.setItem("guest_email", response.data.email);

    // Llamar al callback con el email verificado
    onEmailVerified(response.data.email);

    setIsLoading(false);

  } catch (apiError) {
    setIsLoading(false);
    setError(apiError.response?.data?.error || "Error al verificar el código.");
  }
};

// Función para permitir al usuario cambiar el email
const handleChangeEmail = () => {
  setEmailSent(false);
  setCode("");
  setError("");
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 md:p-4">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Verificar Email
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            {emailSent 
              ? `Ingresa el código enviado a ${email}`
              : "Ingresa tu email para crear una solicitud de soporte"}
          </p>
        </div>

        {/* El formulario cambia según el estado 'emailSent' */}
        <form onSubmit={emailSent ? handleVerifyCode : handleSendCode} className="space-y-4">
          
          {/* PASO 1: Pedir Email */}
          <div style={{ display: !emailSent ? "block" : "none" }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* PASO 2: Pedir Código */}
          <div style={{ display: emailSent ? "block" : "none" }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Código de Verificación
            </label>
            <input
              type="text" // Usar 'text' para que acepte cualquier número
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {emailSent ? "Verificando..." : "Enviando..."}
              </>
            ) : (
              emailSent ? (
                <>
                  Verificar Código
                  <ShieldCheck className="w-5 h-5" />
                </>
              ) : (
                <>
                  Enviar Código
                  <ArrowRight className="w-5 h-5" />
                </>
              )
            )}
          </button>
        </form>
        {emailSent && (
          <div className="mt-4 text-center text-sm">
            <button
              onClick={handleChangeEmail}
              className="text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 inline-block mr-1" />
              Cambiar email
            </button>
            <span className="mx-2 text-gray-400">|</span>
            {/* El botón de "Enviar Código" se convierte en "Reenviar" */}
            <button
              onClick={handleSendCode} 
              className="text-blue-600 hover:text-blue-800 font-semibold"
              disabled={isLoading}
            >
              Reenviar código
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            ¿Tienes una cuenta?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;