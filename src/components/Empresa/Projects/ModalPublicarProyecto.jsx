import React, { useState } from 'react';
import axios from 'axios';
// import '../../../styles/Empresa/ModalPublicarProyecto.css';

// Al inicio del componente
// console.log('Variables de entorno:', {
//     REACT_APP_API_URL: process.env.REACT_APP_API_URL,
//     REACT_APP_ENV: process.env.REACT_APP_ENV,
//     NODE_ENV: process.env.NODE_ENV
// });

const ModalPublicarProyecto = ({ id_usuario, id_proyecto, closeModal, projectTitle = 'Publicación de Proyecto' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const API_URL_FRONT = import.meta.env.VITE_API_URL_FRONT || 'http://localhost:5173';
    // `${API_URL_FRONT}/payment/return?next=${API_URL_FRONT}/myprojects`

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const paymentData = {
        amount: 1000,
        buyOrder: `BO-${id_proyecto}`,
        sessionId: `Session-${id_usuario}`,
        returnUrl: `${API_URL_FRONT}/payment/return?next=${encodeURIComponent('/myprojects')}`,
        projectId: id_proyecto,  
        companyId: id_usuario,
    };

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${API_URL}/payments/create_transaction_project`,
        paymentData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { url, token } = response.data;

      if (!url || !token) throw new Error('No se recibió URL o token de Webpay');

      // redirect to Webpay
      window.location.href = `${url}?token_ws=${token}`;
    } catch (error) {
      console.error('Error al iniciar la transacción:', error);
      setError(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div className="bg-gradient-to-r from-[#07767c] to-[#0a9199] px-6 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{projectTitle}</h2>
          <button 
            onClick={closeModal} 
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Costo de publicación: $1.000
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Al publicar tu proyecto, será visible para todos los usuarios en la plataforma 
              y los Freelancers registrados podrán postular.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
          
          <button
            onClick={handlePayment}
            disabled={loading}
            className="px-6 py-2.5 bg-[#07767c] hover:bg-[#055a5f] text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg 
                  className="animate-spin h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Procesando...
              </>
            ) : 'Pagar y Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
};


export default ModalPublicarProyecto;