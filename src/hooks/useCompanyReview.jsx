import { useState, useEffect } from 'react';
import { verifyUserProfile, createReview } from '@/api/reviewsApi';

export const useCompanyReview = ({
  id_usuario,
  id_identificador,
  userType,
  onClose
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
  const [showModalProject, setShowModalProject] = useState(false);

  // Efecto para manejar el estado del perfil incompleto
  useEffect(() => {
    if (isPerfilIncompleto !== null) {
      if (isPerfilIncompleto === false) {
        setShowModalProject(true);
        setIsPerfilIncompleto(null);
      } else if (isPerfilIncompleto === true) {
        setMessage('Por favor, completa tu perfil para reseñar.');
        setShowMessageModal(true);
      }
    }
  }, [isPerfilIncompleto]);

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
  };

  const resetForm = () => {
    setRating(0);
    setComment('');
    setError('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    // Validación de tipo de usuario
    if (!['empresa', 'freelancer'].includes(userType)) {
      setError('Tiene que iniciar sesión para reseñar.');
      return;
    }

    // Verificar perfil del usuario
    try {
      const perfilIncompleto = await verifyUserProfile(id_usuario, userType);
      
      if (perfilIncompleto === true) {
        setMessage('Por favor, completa tu perfil para reseñar.');
        setShowMessageModal(true);
        return;
      }
    } catch (error) {
      console.error(`Error al verificar el perfil de ${userType}:`, error);
      setMessage(`Error al verificar el perfil. Inténtalo de nuevo más tarde.`);
      setShowMessageModal(true);
      return;
    }

    // Validación de calificación
    if (rating === 0) {
      setError('Por favor, selecciona una calificación');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Enviar reseña
    try {
      await createReview({
        id_usuario: id_usuario,
        calificacion: rating,
        comentario: comment,
        id_identificador: id_identificador
      });
    
      setMessage('Reseña enviada exitosamente');
      setShowMessageModal(true);
      
      setTimeout(() => {
        onClose();
      }, 1000); 
    
      resetForm();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('No puedes reseñar a un usuario del mismo tipo.');
      }
    } finally {
      setIsSubmitting(false);
    }    
  };

  return {
    rating,
    comment,
    error,
    isSubmitting,
    showMessageModal,
    message,
    showModalProject,
    setComment,
    handleRatingChange,
    handleSubmitReview,
    closeMessageModal
  };
};