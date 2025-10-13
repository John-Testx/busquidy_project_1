import React, { useState, useEffect } from 'react';
import MessageModal from '../MessageModal';
import { verifyUserProfile, createReview } from '../../api/reviewsApi';

const CompanyReviewModal = ({
  isOpen,
  onClose,
  id_identificador,
  id_usuario,
  userType,
  onReviewButtonClick
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
  const [showModalProject, setShowModalProject] = useState(false);

  const closeMessageModal = () => {
    setShowMessageModal(false);
  };

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!['empresa', 'freelancer'].includes(userType)) {
      setError('Tiene que iniciar sesión para reseñar.');
      return;
    }

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

    if (rating === 0) {
      setError('Por favor, selecciona una calificación');
      return;
    }

    setIsSubmitting(true);
    setError('');

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
    
      setRating(0);
      setComment('');
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

  const StarRating = () => {
    return (
      <div className="flex justify-center mb-6 gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className={`text-5xl cursor-pointer transition-all duration-200 ${
              star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-300'
            } hover:text-yellow-300 hover:scale-125`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const ReviewButton = () => {
    if (userType !== 'freelancer') {
      return null;
    }
    return (
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        onClick={onReviewButtonClick}
      >
        Dejar Reseña
      </button>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1100] p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg max-h-[90%] overflow-y-auto shadow-2xl animate-[modalSlideIn_0.3s_ease-out]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⭐</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 m-0">Califica a la Empresa</h2>
          <p className="text-gray-600 mt-2">Tu opinión es muy valiosa para otros freelancers</p>
        </div>
       
        <form onSubmit={handleSubmitReview}>
          {/* Rating Section */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700 font-semibold text-center text-lg">
              Calificación
            </label>
            <StarRating />
            {rating > 0 && (
              <p className="text-center text-[#07767c] font-medium mt-2">
                {rating === 1 && "Muy malo"}
                {rating === 2 && "Malo"}
                {rating === 3 && "Regular"}
                {rating === 4 && "Bueno"}
                {rating === 5 && "Excelente"}
              </p>
            )}
          </div>

          {/* Comment Section */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-700 font-semibold">
              Comentario <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia trabajando con esta empresa..."
              rows="5"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#07767c]/20 focus:border-[#07767c] resize-none transition-all duration-200"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-center font-medium">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 py-3.5 bg-gray-200 text-gray-700 rounded-xl border-none cursor-pointer font-bold hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white rounded-xl border-none cursor-pointer font-bold hover:from-[#05595d] hover:to-[#043d42] transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
            </button>
          </div>
        </form>

        {/* Message Modal */}
        {showMessageModal && (
          <MessageModal message={message} closeModal={closeMessageModal} />
        )}
      </div>
    </div>
  );
};

export default CompanyReviewModal;