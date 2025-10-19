import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {usePaymentVerification} from "@/hooks";

const PaymentReturn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Obtener parámetros de la URL
  const token = searchParams.get("token_ws");
  let next = decodeURIComponent(searchParams.get("next") || "/");

  // Validar y sanitizar la URL de redirección
  if (!next.startsWith("/")) {
    next = "/";
    console.log("Changing next param:", next);
  }

  // Usar el custom hook para verificar el pago
  const { status, loading, shouldRedirect } = usePaymentVerification(token, next);

  /**
   * Redirige al usuario cuando se completa la verificación
   */
  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        try {
          navigate(next);
        } catch {
          navigate("/");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, next, navigate]);

  /**
   * Determina el color del mensaje según el estado
   */
  const getStatusColor = () => {
    if (status.includes("✅")) return "text-green-600";
    if (status.includes("❌")) return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Estado del Pago
        </h2>
        
        {loading && (
          <div className="flex items-center justify-center mb-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span className="text-gray-600">Procesando...</span>
          </div>
        )}

        <p className={`text-lg font-medium ${getStatusColor()}`}>
          {status}
        </p>
      </div>
    </div>
  );
};

export default PaymentReturn;