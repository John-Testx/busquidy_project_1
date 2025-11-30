import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { getContactRequestById, respondContactRequest } from '@/api/contactRequestApi';
import MainLayout from '@/components/Layouts/MainLayout';
import LoadingScreen from '@/components/LoadingScreen';

const InterviewRequestPage = () => {
  const { id_solicitud } = useParams();
  const navigate = useNavigate();
  
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');

  useEffect(() => {
    fetchSolicitud();
  }, [id_solicitud]);

  const fetchSolicitud = async () => {
    try {
      setLoading(true);
      const data = await getContactRequestById(id_solicitud);
      setSolicitud(data);
      setError('');
    } catch (err) {
      console.error('Error al cargar solicitud:', err);
      setError('No se pudo cargar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleResponder = async (respuesta) => {
    if (respuesta === 'reprogramar' && !nuevaFecha) {
      setError('Debes seleccionar una nueva fecha para reprogramar');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = {
        respuesta,
        nueva_fecha: respuesta === 'reprogramar' ? nuevaFecha : null
      };
      console.log('Datos enviados para responder:', data);
      await respondContactRequest(id_solicitud, data);
      
      setSuccess(
        respuesta === 'aceptada' 
          ? '✅ Entrevista aceptada exitosamente' 
          : respuesta === 'rechazada'
          ? '✅ Entrevista rechazada'
          : '✅ Nueva fecha sugerida enviada'
      );

      setTimeout(() => {
        navigate('/notifications');
      }, 2000);

    } catch (err) {
      console.error('Error al responder solicitud:', err);
      setError(err.response?.data?.error || 'Error al procesar tu respuesta');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!solicitud) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Solicitud no encontrada'}</p>
            <button
              onClick={() => navigate('/notifications')}
              className="px-6 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#055a5f] transition-colors"
            >
              Volver a Notificaciones
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    const date = new Date(fecha);
    return date.toLocaleString('es-CL', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate('/notifications')}
            className="flex items-center gap-2 text-[#07767c] hover:text-[#055a5f] font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a Notificaciones
          </button>

          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-[#07767c] to-[#0a9199] p-6">
              <div className="flex items-center gap-3 text-white">
                <Calendar size={32} />
                <div>
                  <h1 className="text-2xl font-bold">Solicitud de Entrevista</h1>
                  <p className="text-teal-100">
                    {solicitud.estado_solicitud === 'pendiente' ? 'Pendiente de respuesta' : `Estado: ${solicitud.estado_solicitud}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Información de la empresa */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Empresa</h3>
                <p className="text-xl font-semibold text-gray-900">{solicitud.nombre_empresa}</p>
              </div>

              {/* Proyecto */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Proyecto</h3>
                <p className="text-lg text-gray-900">{solicitud.nombre_proyecto}</p>
              </div>

              {/* Fecha sugerida */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-blue-600" size={24} />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Fecha y hora sugerida</h3>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatFecha(solicitud.fecha_entrevista_sugerida)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              {solicitud.mensaje_solicitud && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Mensaje de la empresa</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{solicitud.mensaje_solicitud}</p>
                  </div>
                </div>
              )}

              {/* Mensajes de error/éxito */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700">{success}</p>
                </div>
              )}

              {/* Opciones de respuesta */}
              {solicitud.estado_solicitud === 'pendiente' && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">¿Qué deseas hacer?</h3>

                  {/* Botones de acción */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleResponder('aceptada')}
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Aceptar
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleResponder('rechazada')}
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <XCircle size={20} />
                          Rechazar
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => document.getElementById('reprogramar-section').scrollIntoView({ behavior: 'smooth' })}
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw size={20} />
                      Reprogramar
                    </button>
                  </div>

                  {/* Sección de reprogramar */}
                  <div id="reprogramar-section" className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-amber-900">Sugerir nueva fecha</h4>
                    <input
                      type="datetime-local"
                      value={nuevaFecha}
                      onChange={(e) => setNuevaFecha(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      min={new Date().toISOString().slice(0, 16)}
                      disabled={submitting}
                    />
                    <button
                      onClick={() => handleResponder('reprogramar')}
                      disabled={submitting || !nuevaFecha}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar nueva fecha'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Estado ya respondido */}
              {solicitud.estado_solicitud !== 'pendiente' && (
                <div className={`p-4 rounded-lg ${
                  solicitud.estado_solicitud === 'aceptada' 
                    ? 'bg-green-50 border border-green-200' 
                    : solicitud.estado_solicitud === 'rechazada'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <p className={`font-semibold ${
                    solicitud.estado_solicitud === 'aceptada' 
                      ? 'text-green-700' 
                      : solicitud.estado_solicitud === 'rechazada'
                      ? 'text-red-700'
                      : 'text-amber-700'
                  }`}>
                    {solicitud.estado_solicitud === 'aceptada' && '✅ Ya has aceptado esta entrevista'}
                    {solicitud.estado_solicitud === 'rechazada' && '❌ Has rechazado esta entrevista'}
                    {solicitud.estado_solicitud === 'reprogramar' && '🔄 Has sugerido una nueva fecha'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InterviewRequestPage;