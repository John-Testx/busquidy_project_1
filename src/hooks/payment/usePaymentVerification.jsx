import { useState, useEffect, useCallback } from 'react';
import { commitTransaction } from '@/api/paymentApi';

/**
 * Custom hook para manejar la verificación de pagos con reintentos automáticos
 * @param {string} token - Token de Webpay
 * @param {string} redirectUrl - URL a la que redirigir después del pago
 * @param {number} maxRetries - Número máximo de reintentos (default: 5)
 * @returns {Object} Estado de la verificación del pago
 */
function usePaymentVerification(token, redirectUrl, maxRetries = 5) {
  const [status, setStatus] = useState("Verificando transacción...");
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  /**
   * Verifica el estado de la transacción con reintentos automáticos
   */
  const verifyPayment = useCallback(async (attempt = 0) => {
    if (!token) {
      setStatus("❌ Token de pago no encontrado");
      setLoading(false);
      return;
    }

    try {
      const data = await commitTransaction(token);
      
      console.log("Response of current transaction", data);

      // Pago aprobado
      if (data.status === "APPROVED") {
        setStatus("✅ Pago exitoso");
        setLoading(false);
        setShouldRedirect(true);
        return;
      }

      // Pago rechazado
      if (data.status === "REJECTED") {
        setStatus(`❌ Pago rechazado: ${data.message || "Sin detalles"}`);
        setLoading(false);
        return;
      }

      // Otro estado
      setStatus(`⚠️ Estado: ${data.status}`);
      setLoading(false);

    } catch (err) {
      console.log("Error response", err);
      
      const code = err.code;
      const statusCode = err.status;
      const errorMessage = err.error || err.message;

      // Transacción en proceso - reintentar
      if (code === "TRANSACTION_IN_PROGRESS" && attempt < maxRetries) {
        const delay = 2000 * (attempt + 1);
        setStatus(`⚠️ Transacción en proceso. Reintentando en ${delay / 1000}s...`);
        setTimeout(() => verifyPayment(attempt + 1), delay);
        return;
      }
      
      // Pago pendiente - reintentar
      if (code === "PENDING" && attempt < maxRetries) {
        const delay = 2000 * (attempt + 1);
        setStatus(`⚠️ Confirmando pago... (reintentando en ${delay / 1000}s)`);
        setTimeout(() => verifyPayment(attempt + 1), delay);
        return;
      }

      // Suscripción activa existente
      if (statusCode === 409 || code === "ACTIVE_SUBSCRIPTION_EXISTS") {
        setStatus("❌ Ya tienes una suscripción activa. Cancela tu suscripción actual para continuar.");
        setLoading(false);
        setShouldRedirect(true);
        return;
      }

      // Error general
      setStatus(`❌ Error verificando el pago: ${errorMessage}`);
      setLoading(false);
    }
  }, [token, maxRetries]);

  /**
   * Inicia la verificación al montar el hook
   */
  useEffect(() => {
    verifyPayment(0);
  }, [verifyPayment]);

  return {
    status,
    loading,
    shouldRedirect,
    retry: () => verifyPayment(0)
  };
}

export default usePaymentVerification;