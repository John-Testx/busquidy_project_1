// src/pages/Freelancer/TakeTest.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/auth/useAuth';
import apiClient from '@/api/apiClient';
import LoadingScreen from '@/components/LoadingScreen';

const TakeTest = () => {
  const { user } = useAuth(); // AuthContext devuelve el objeto user
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // CORRECCIÓN 1: Usar user.id_usuario en lugar de user.id
        const statusRes = await apiClient.get(`/freelancer/test/status/${user.id_usuario}`);
        
        if (statusRes.data.hasTakenTest) {
          setAlreadyTaken(true);
          setLoading(false);
          return; // Detenemos aquí si ya lo hizo
        }

        // 2. Obtener preguntas públicas
        const questionsRes = await apiClient.get('/freelancer/test/questions');
        setQuestions(questionsRes.data);
        
      } catch (error) {
        console.error("Error cargando el test:", error);
        setStatusMessage({ type: 'error', text: 'No se pudo cargar el test. Intenta nuevamente.' });
      } finally {
        setLoading(false); // Esto asegura que el loading se quite siempre
      }
    };

    // CORRECCIÓN 2: Validar user.id_usuario en la condición
    if (user && user.id_usuario) {
      fetchData();
    }
  }, [user]);

  const handleOptionChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
    if (statusMessage.type === 'error') setStatusMessage({ type: '', text: '' });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setStatusMessage({ 
        type: 'error', 
        text: `Has respondido ${Object.keys(answers).length} de ${questions.length} preguntas. Por favor responde todas.` 
      });
      window.scrollTo(0, 0);
      return;
    }

    setSubmitting(true);
    try {
      // CORRECCIÓN 3: Asegurarse de enviar el id_usuario correcto
      await apiClient.post('/freelancer/test/submit', {
        id_usuario: user.id_usuario,
        answers: answers
      });

      setStatusMessage({ type: 'success', text: '¡Test completado con éxito! Redirigiendo...' });
      
      setTimeout(() => {
        navigate('/freelancer-profile/view-profile');
      }, 2000);

    } catch (error) {
      console.error(error);
      // Manejo de error más específico si el backend envía mensaje
      const msg = error.response?.data?.message || 'Hubo un error al guardar tus respuestas. Inténtalo de nuevo.';
      setStatusMessage({ type: 'error', text: msg });
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen />;

  if (alreadyTaken) {
    return (
      <div className="p-8 text-center bg-white shadow rounded-lg max-w-2xl mx-auto mt-10 border border-gray-200">
        <h2 className="text-2xl font-bold text-green-600 mb-4">¡Test Completado!</h2>
        <p className="text-gray-600 mb-6">Ya has realizado la prueba psicológica. Tu insignia de compromiso ya está visible en tu perfil.</p>
        <button 
          onClick={() => navigate('/freelancer-profile/view-profile')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Volver a mi Perfil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Test de Compromiso Busquidy</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Evalúa tu nivel de responsabilidad y ética laboral. 
            (1 = Totalmente en desacuerdo, 5 = Totalmente de acuerdo).
          </p>
        </div>

        {statusMessage.text && (
          <div className={`mb-6 p-4 rounded-md ${
            statusMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {statusMessage.text}
          </div>
        )}

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={q.id_pregunta} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-800 mb-4">
                <span className="font-bold text-blue-600 mr-2">{index + 1}.</span> 
                {q.enunciado}
              </p>
              
              <div className="grid grid-cols-5 gap-2 md:gap-4">
                {[1, 2, 3, 4, 5].map((val) => (
                  <label 
                    key={val} 
                    className={`
                      flex flex-col items-center justify-center p-2 rounded cursor-pointer border transition-all text-center
                      ${answers[q.id_pregunta] === val 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' 
                        : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-600'}
                    `}
                  >
                    <input
                      type="radio"
                      name={`question_${q.id_pregunta}`}
                      value={val}
                      checked={answers[q.id_pregunta] === val}
                      onChange={() => handleOptionChange(q.id_pregunta, val)}
                      className="hidden"
                    />
                    <span className="text-lg font-bold">{val}</span>
                    <span className="text-[10px] md:text-xs mt-1 hidden md:block">
                      {val === 1 ? 'En desacuerdo' : val === 5 ? 'De acuerdo' : ''}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`
              px-8 py-3 text-white font-bold rounded-lg shadow-md transition-all
              ${submitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105'}
            `}
          >
            {submitting ? 'Guardando...' : 'Finalizar Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeTest;