// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../../styles/Freelancer/CompanyReviewModal.css';
// import MessageModal from '../MessageModal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../../styles/Freelancer/CompanyReviewModal.css';
import MessageModal from '../../MessageModal'; 

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

  const verifyUserProfile = async () => {
    try {
      let response;
      if (userType === 'empresa') {
        response = await axios.get(`http://localhost:3001/api/empresa/${id_usuario}`);
      } else if (userType === 'freelancer') {
        response = await axios.get(`http://localhost:3001/api/freelancer/get/${id_usuario}`);
      } else {
        throw new Error('Tipo de usuario no válido');
      }

      if (response.data && typeof response.data.isPerfilIncompleto === "boolean") {
        return response.data.isPerfilIncompleto;
      } else {
        throw new Error("Respuesta del servidor inesperada");
      }
    } catch (error) {
      console.error(`Error al verificar el perfil de ${userType}:`, error);
      setMessage(`Error al verificar el perfil. Inténtalo de nuevo más tarde.`);
      setShowMessageModal(true);
      return null;
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    // Validate user type and login status
    if (!['empresa', 'freelancer'].includes(userType)) {
      setError('Tiene que iniciar sesión para reseñar.');
      return;
    }

    // Check if profile is complete
    const perfilIncompleto = await verifyUserProfile();
    if (perfilIncompleto === true) {
      setMessage('Por favor, completa tu perfil para reseñar.');
      setShowMessageModal(true);
      return;
    } else if (perfilIncompleto === null) {
      // Error occurred during profile verification
      return;
    }

    // Validate rating
    if (rating === 0) {
      setError('Por favor, selecciona una calificación');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/empresa/reviews', {
        id_usuario: id_usuario,
        calificacion: rating,
        comentario: comment,
        id_identificador: id_identificador
      });
    
      // Si el backend no genera errores
      setMessage('Reseña enviada exitosamente');
      setShowMessageModal(true);
      setTimeout(() => {
        onClose(); // Cierra el modal después de que el mensaje sea visible
      }, 1000); 
    
      // Reset form
      setRating(0);
      setComment('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        // Usar el mensaje que viene del backend
        setError(err.response.data.message);
      } else {
        // Mensaje genérico para errores inesperados
        setError('No puedes reseñar a un usuario del mismo tipo.');
      }
    } finally {
      setIsSubmitting(false);
    }    
  };

  const StarRating = () => {
    return (
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRatingChange(star)}
            className={`text-4xl cursor-pointer transition-colors duration-200 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-300`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const ReviewButton = () => {
    // Only show for freelancers
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
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-white p-5 rounded-lg w-[90%] max-w-lg max-h-[90%] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">Califica a la Empresa</h2>
       
        <form onSubmit={handleSubmitReview}>
          {/* Rating Section */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-medium">Calificación</label>
            <StarRating />
          </div>

          {/* Comment Section */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-medium">Comentario (Opcional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tu experiencia con la empresa"
              rows="4"
              className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 mb-2.5 text-center font-medium">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            <button
              type="button"
              className="px-4 py-2.5 bg-red-500 text-white rounded border-none cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-green-500 text-white rounded border-none cursor-pointer hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
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

      {/* Render review button conditionally */}
      {/* <ReviewButton /> */}
    </div>
  );
};

export default CompanyReviewModal;