import { useState, useEffect, useRef, useCallback } from 'react';
import { commitPaymentTransaction } from '@/api/projectsApi';

/**
 * Hook para manejar el callback de pagos de Webpay
 * @returns {Object} Estado del pago procesado
 */
function usePaymentCallback() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false); // ✅ Prevenir múltiples llamadas simultáneas

  /**
   * Procesa el callback de pago de Webpay
   * @param {URLSearchParams} searchParams - Parámetros de la URL
   */
  const processPaymentCallback = useCallback(async (searchParams) => {
    const token_ws = searchParams.get("token_ws");
    const TBK_TOKEN = searchParams.get("TBK_TOKEN");

    if (!token_ws && !TBK_TOKEN) return;

    // ✅ Prevenir múltiples ejecuciones simultáneas
    if (processingRef.current) {
      console.log('⚠️ Ya hay un procesamiento en curso, ignorando llamada duplicada');
      return;
    }

    // Verificar si ya se procesó esta transacción
    const processedToken = sessionStorage.getItem('processed_token');
    if (processedToken === token_ws) {
      console.log('✅ Transacción ya procesada previamente');
      setPaymentStatus({
        success: true,
        message: "Pago procesado exitosamente",
        type: "ALREADY_PROCESSED",
      });
      return;
    }

    // Verificar si ya se está procesando
    const processingToken = sessionStorage.getItem('processing_token');
    if (processingToken === token_ws) {
      console.log('⏳ Transacción en proceso, esperando...');
      setPaymentStatus({
        success: false,
        message: "La transacción está siendo procesada. Por favor, espera.",
        type: "PROCESSING",
      });
      return;
    }

    try {
      processingRef.current = true; // ✅ Marcar como procesando
      setIsProcessing(true);

      if (TBK_TOKEN) {
        setPaymentStatus({
          success: false,
          message: "El pago fue cancelado.",
          type: "CANCELLED",
        });
        sessionStorage.setItem('processed_token', TBK_TOKEN);
        return;
      }

      // Marcar como procesando
      sessionStorage.setItem('processing_token', token_ws);
      console.log('🔄 Iniciando procesamiento de pago...');

      const data = await commitPaymentTransaction(token_ws);

      // Marcar como procesado
      sessionStorage.setItem('processed_token', token_ws);
      sessionStorage.removeItem('processing_token');

      console.log('✅ Respuesta del servidor:', data);

      if (data.status === "APPROVED") {
        const details =
          data.type === "SUBSCRIPTION"
            ? {
                plan: data.plan,
                subscriptionStart: data.subscriptionStart,
                subscriptionEnd: data.subscriptionEnd,
              }
            : data.type === "PROJECT_PUBLICATION"
            ? { projectId: data.projectId }
            : {};

        setPaymentStatus({
          success: true,
          message: data.message || "Pago procesado exitosamente.",
          type: data.type,
          details: {
            amount: data.amount,
            buyOrder: data.buyOrder,
            ...details,
          },
        });

        return data;
      } else if (data.status === "REJECTED") {
        setPaymentStatus({
          success: false,
          message: data.message || "Pago rechazado.",
          type: data.type,
          reason: data.reason,
          details: {
            amount: data.amount,
            buyOrder: data.buyOrder,
          },
        });
      } else if (data.status === "PENDING") {
        // El backend nos dice que aún está procesando
        setPaymentStatus({
          success: false,
          message: data.message || "Procesando pago...",
          type: "PROCESSING",
        });
        
        // Intentar de nuevo después de 2 segundos
        setTimeout(() => {
          sessionStorage.removeItem('processing_token');
          processingRef.current = false;
          window.location.reload();
        }, 2000);
      } else {
        setPaymentStatus({
          success: false,
          message: data.error || "Error inesperado al procesar el pago.",
          type: "ERROR",
          code: data.code,
          details: data.details,
        });
      }
    } catch (error) {
      console.error("❌ Error procesando el pago:", error);
      sessionStorage.removeItem('processing_token');

      // Manejo especial para diferentes errores
      if (error.response?.status === 409) {
        // 409 Conflict = Transacción en proceso
        setPaymentStatus({
          success: false,
          message: "La transacción está siendo procesada. Recargando...",
          type: "PROCESSING",
        });

        setTimeout(() => {
          sessionStorage.removeItem('processing_token');
          processingRef.current = false;
          window.location.reload();
        }, 2000);
      } else if (error.response?.status === 404) {
        // 404 = Transacción no encontrada
        setPaymentStatus({
          success: false,
          message: "No se encontró la transacción. Por favor, contacta soporte.",
          type: "NOT_FOUND",
        });
      } else {
        setPaymentStatus({
          success: false,
          message: error.response?.data?.error || "Error al procesar el pago.",
          type: "NETWORK_ERROR",
          code: error.response?.data?.code || "UNKNOWN_ERROR",
          details: error.response?.data || error.message,
        });
      }
    } finally {
      setIsProcessing(false);
      processingRef.current = false; // ✅ Liberar lock
    }
  }, []); // ✅ useCallback con dependencias vacías para crear la función una sola vez

  /**
   * Limpia el estado del pago
   */
  const clearPaymentStatus = () => {
    setPaymentStatus(null);
  };

  return {
    paymentStatus,
    isProcessing,
    processPaymentCallback,
    clearPaymentStatus,
  };
}

export default usePaymentCallback;