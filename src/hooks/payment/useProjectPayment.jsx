import { useState } from 'react';
import { createProjectPayment } from '@/api/projectsApi';

/**
 * Custom hook para gestionar el pago de publicación de proyectos
 * @returns {Object} Estado y funciones para gestionar pagos
 */
function useProjectPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Inicia el proceso de pago para publicar un proyecto
   * @param {Object} paymentData - Datos del pago
   */
  const initiatePayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!paymentData?.projectId) {
      throw new Error("El ID del proyecto (projectId) es requerido");
      }

      const { url, token } = await createProjectPayment(paymentData);

      if (!url || !token) {
        throw new Error('No se recibió URL o token de Webpay');
      }

      // Redirigir a Webpay
      window.location.href = `${url}?token_ws=${token}`;
      return true;
    } catch (err) {
      console.error('Error al iniciar la transacción:', err);
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Error: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reinicia el estado de error
   */
  const clearError = () => setError(null);

  return {
    loading,
    error,
    initiatePayment,
    clearError,
  };
}

export default useProjectPayment;