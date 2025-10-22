import { useState, useCallback } from 'react';
import { createEmpresaProfile } from '@/api/empresaApi';
import { toast } from 'react-toastify';

/**
 * Custom hook para gestionar la creación del perfil de empresa
 * @param {Object} options - Opciones del hook
 * @param {number} options.id_usuario - ID del usuario
 * @param {Function} options.onSuccess - Callback a ejecutar cuando el perfil se crea exitosamente
 * @returns {Object} Estado y funciones para gestionar la creación del perfil
 */
function useEmpresaProfile({ id_usuario, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Crea el perfil de la empresa
   * @param {Object} data - Datos del formulario
   * @param {Object} data.empresa - Datos de la empresa
   * @param {Object} data.representante - Datos del representante
   */
  const createProfile = useCallback(async (data) => {
    if (!id_usuario) {
      setError('ID de usuario no proporcionado');
      toast.error('Error: Usuario no identificado');
      return false;
    }

    console.log("=== ENVIANDO DATOS DEL FORMULARIO ===");
    console.log("Datos empresa:", data.empresa);
    console.log("Datos representante:", data.representante);
    console.log("ID Usuario:", id_usuario);

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await createEmpresaProfile(
        data.empresa,
        data.representante,
        id_usuario
      );

      console.log("✅ Respuesta del servidor:", response);

      // Mostrar pantalla de éxito
      setShowSuccess(true);

      // Esperar 2 segundos antes de ejecutar el callback
      setTimeout(async () => {
        if (onSuccess && typeof onSuccess === 'function') {
          console.log("Llamando a onSuccess...");
          await onSuccess();
        }
      }, 2000);

      return true;
    } catch (err) {
      console.error("❌ Error al crear el perfil de la empresa:", err);

      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Error al crear el perfil de empresa";
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [id_usuario, onSuccess]);

  /**
   * Reinicia el estado del hook
   */
  const reset = useCallback(() => {
    setIsSubmitting(false);
    setShowSuccess(false);
    setError(null);
  }, []);

  return {
    isSubmitting,
    showSuccess,
    error,
    createProfile,
    reset
  };
}

export default useEmpresaProfile;