// src/pages/Freelancer/TakeTest.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, AlertCircle, Award, ChevronRight } from 'lucide-react';
import useAuth from '@/hooks/auth/useAuth';
import apiClient from '@/api/apiClient';
import LoadingScreen from '@/components/LoadingScreen';

const TakeTest = () => {
  const { user } = useAuth();
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
        const statusRes = await apiClient.get(`/freelancer/test/status/${user.id_usuario}`);
        
        if (statusRes.data.hasTakenTest) {
          setAlreadyTaken(true);
          setLoading(false);
          return;
        }

        const questionsRes = await apiClient.get('/freelancer/test/questions');
        setQuestions(questionsRes.data);
        
      } catch (error) {
        console.error("Error cargando el test:", error);
        setStatusMessage({ type: 'error', text: 'No se pudo cargar el test. Intenta nuevamente.' });
      } finally {
        setLoading(false);
      }
    };

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
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
      const msg = error.response?.data?.message || 'Hubo un error al guardar tus respuestas. Inténtalo de nuevo.';
      setStatusMessage({ type: 'error', text: msg });
      setSubmitting(false);
    }
  };

  const calculateProgress = () => {
    return Math.round((Object.keys(answers).length / questions.length) * 100);
  };

  if (loading) return <LoadingScreen />;

  if (alreadyTaken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header del card */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">¡Test Completado!</h2>
              <p className="text-white/90">Tu insignia de compromiso está activa</p>
            </div>

            {/* Body del card */}
            <div className="p-8 text-center">
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-gray-700 leading-relaxed">
                  Ya has realizado la prueba psicológica. Tu insignia de compromiso ya está visible en tu perfil y demuestra tu profesionalismo ante las empresas.
                </p>
              </div>

              <button 
                onClick={() => navigate('/freelancer-profile/view-profile')}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Volver a mi Perfil
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header MEJORADO */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl flex items-center justify-center">
              <FileText className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test de Compromiso Busquidy</h1>
              <p className="text-gray-600">Evalúa tu nivel de responsabilidad y ética laboral</p>
            </div>
          </div>

          {/* Barra de progreso */}
          {questions.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Progreso del test</span>
                <span className="text-sm font-bold text-[#07767c]">
                  {Object.keys(answers).length} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#07767c] to-[#05595d] h-full transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {calculateProgress() === 100 ? '¡Todas las preguntas respondidas! Puedes finalizar.' : 'Responde todas las preguntas para continuar.'}
              </p>
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
          {/* Instrucciones mejoradas */}
          <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Instrucciones</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Lee cada afirmación cuidadosamente y selecciona el número que mejor represente tu opinión, donde:
                </p>
                <div className="mt-3 grid grid-cols-5 gap-2 text-xs">
                  <div className="text-center p-2 bg-white rounded-lg border border-blue-200">
                    <div className="font-bold text-red-600">1</div>
                    <div className="text-gray-600 mt-1">Totalmente en desacuerdo</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg border border-blue-200">
                    <div className="font-bold text-orange-600">2</div>
                    <div className="text-gray-600 mt-1">En desacuerdo</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg border border-blue-200">
                    <div className="font-bold text-yellow-600">3</div>
                    <div className="text-gray-600 mt-1">Neutral</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg border border-blue-200">
                    <div className="font-bold text-lime-600">4</div>
                    <div className="text-gray-600 mt-1">De acuerdo</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg border border-blue-200">
                    <div className="font-bold text-green-600">5</div>
                    <div className="text-gray-600 mt-1">Totalmente de acuerdo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mensajes de estado mejorados */}
          {statusMessage.text && (
            <div className={`mb-6 p-4 rounded-xl border-2 ${
              statusMessage.type === 'error' 
                ? 'bg-red-50 text-red-800 border-red-200' 
                : 'bg-green-50 text-green-800 border-green-200'
            }`}>
              <div className="flex items-center gap-3">
                {statusMessage.type === 'error' ? (
                  <AlertCircle className="flex-shrink-0" size={20} />
                ) : (
                  <CheckCircle className="flex-shrink-0" size={20} />
                )}
                <p className="font-semibold">{statusMessage.text}</p>
              </div>
            </div>
          )}

          {/* Preguntas mejoradas */}
          <div className="space-y-6">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id_pregunta] !== undefined;
              
              return (
                <div 
                  key={q.id_pregunta} 
                  className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                    isAnswered 
                      ? 'bg-gradient-to-br from-[#07767c]/5 to-[#40E0D0]/5 border-[#07767c]/30' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Encabezado de la pregunta */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${
                      isAnswered 
                        ? 'bg-[#07767c] text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="font-medium text-gray-900 leading-relaxed">
                      {q.enunciado}
                    </p>
                    {isAnswered && (
                      <CheckCircle className="text-[#07767c] flex-shrink-0" size={20} />
                    )}
                  </div>
                  
                  {/* Opciones de respuesta mejoradas */}
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = answers[q.id_pregunta] === val;
                      const colors = {
                        1: { bg: 'bg-red-600', hover: 'hover:bg-red-50 hover:border-red-300', border: 'border-red-600' },
                        2: { bg: 'bg-orange-600', hover: 'hover:bg-orange-50 hover:border-orange-300', border: 'border-orange-600' },
                        3: { bg: 'bg-yellow-600', hover: 'hover:bg-yellow-50 hover:border-yellow-300', border: 'border-yellow-600' },
                        4: { bg: 'bg-lime-600', hover: 'hover:bg-lime-50 hover:border-lime-300', border: 'border-lime-600' },
                        5: { bg: 'bg-green-600', hover: 'hover:bg-green-50 hover:border-green-300', border: 'border-green-600' }
                      };

                      return (
                        <label 
                          key={val} 
                          className={`
                            flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer border-2 transition-all duration-200 text-center
                            ${isSelected 
                              ? `${colors[val].bg} ${colors[val].border} text-white shadow-lg transform scale-105` 
                              : `bg-white border-gray-300 text-gray-700 ${colors[val].hover}`
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name={`question_${q.id_pregunta}`}
                            value={val}
                            checked={isSelected}
                            onChange={() => handleOptionChange(q.id_pregunta, val)}
                            className="hidden"
                          />
                          <span className="text-2xl font-bold mb-1">{val}</span>
                          <span className="text-[10px] md:text-xs font-medium hidden md:block">
                            {val === 1 && 'Muy en desacuerdo'}
                            {val === 2 && 'En desacuerdo'}
                            {val === 3 && 'Neutral'}
                            {val === 4 && 'De acuerdo'}
                            {val === 5 && 'Muy de acuerdo'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón de envío mejorado */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-gray-900">
                {Object.keys(answers).length === questions.length 
                  ? '¡Listo para enviar!' 
                  : `Faltan ${questions.length - Object.keys(answers).length} preguntas`}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {Object.keys(answers).length === questions.length 
                  ? 'Has completado todas las preguntas del test' 
                  : 'Completa todas las preguntas para continuar'}
              </p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < questions.length}
              className={`
                px-8 py-4 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                ${submitting || Object.keys(answers).length < questions.length
                  ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                  : 'bg-gradient-to-r from-[#07767c] to-[#05595d] hover:shadow-xl hover:-translate-y-0.5'}
              `}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  Finalizar Test
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeTest;