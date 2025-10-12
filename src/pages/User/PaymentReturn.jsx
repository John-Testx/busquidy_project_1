import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentReturn = () => {
  const [status, setStatus] = useState("Verificando transacción...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = searchParams.get("token_ws");
  let next = decodeURIComponent(searchParams.get("next") || "/");

  if (!next.startsWith("/")) {
    next = "/";
    console.log("Changing next param:", next);
  }

  const maxRetries = 5;

  const navigateToNext = () => {
    try {
      navigate(next);
    } catch {
      navigate("/");
    }
  };

  const verifyPayment = async (attempt = 0) => {
    if (!token) {
      setStatus("❌ Token de pago no encontrado");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/payments/commit_transaction`, { token });
      const data = response.data;

      console.log("Response of current transaction",data);

      if (data.status === "APPROVED") {
        setStatus("✅ Pago exitoso");
        setLoading(false);
        setTimeout(navigateToNext, 2000);
        return;
      }

      if (data.status === "REJECTED") {
        setStatus(`❌ Pago rechazado: ${data.message || "Sin detalles"}`);
        setLoading(false);
        return;
      }

      setStatus(`⚠️ Estado: ${data.status}`);
      setLoading(false);

    } catch (err) {

      console.log("Error response", err.response?.data);
      
      const code = err.response?.data?.code;
      const statusCode = err.response?.status;

      if (code === "TRANSACTION_IN_PROGRESS" && attempt < maxRetries) {
        const delay = 2000 * (attempt + 1);
        setStatus(`⚠️ Transacción en proceso. Reintentando en ${delay / 1000}s...`);
        setTimeout(() => verifyPayment(attempt + 1), delay);
        return;
      }
      
      if (code === "PENDING" && attempt < maxRetries) {
        const delay = 2000 * (attempt + 1);
        setStatus(`⚠️ Confirmando pago... (reintentando en ${delay / 1000}s)`);
        setTimeout(() => verifyPayment(attempt + 1), delay);
        return;
      }

      if (statusCode === 409 || code === "ACTIVE_SUBSCRIPTION_EXISTS") {
        setStatus("❌ Ya tienes una suscripción activa. Cancela tu suscripción actual para continuar.");
        setLoading(false);
        setTimeout(navigateToNext, 2000);
        return;
      }

      setStatus(`❌ Error verificando el pago: ${err.response?.data?.error || err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment(0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Estado del Pago</h2>
        
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

        <p
          className={`text-lg font-medium ${
            status.includes("✅")
              ? "text-green-600"
              : status.includes("❌")
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
};

export default PaymentReturn;
