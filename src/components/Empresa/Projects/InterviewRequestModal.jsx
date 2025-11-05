import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Send, Loader2 } from 'lucide-react';
import { getFreelancerAvailability } from '@/api/availabilityApi';
import { createContactRequest } from '@/api/contactRequestApi';

const InterviewRequestModal = ({ isOpen, onClose, postulant }) => {
  const [loading, setLoading] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [formData, setFormData] = useState({
    fecha_entrevista_sugerida: '',
    mensaje_solicitud: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mapeo de días en español
  const diasSemana = {
    'lunes': 'Lunes',
    'martes': 'Martes',
    'miércoles': 'Miércoles',
    'jueves': 'Jueves',
    'viernes': 'Viernes',
    'sábado': 'Sábado',
    'domingo': 'Domingo'
  };

  // Cargar disponibilidad del freelancer
  useEffect(() => {
    if (isOpen && postulant?.id_usuario) {
      fetchAvailability();
    }
  }, [isOpen, postulant]);

  const fetchAvailability = async () => {
    try {
      setLoadingAvailability(true);
      setError('');
      
      // Necesitamos obtener el id_freelancer desde el id_usuario
      // Asumiendo que el backend puede manejar esto o ya tienes el id_freelancer
      const response = await getFreelancerAvailability(postulant.id_usuario);
      setAvailability(response.data || []);
    } catch (err) {
      console.error('Error al cargar disponibilidad:', err);
      setError('No se pudo cargar la disponibilidad del freelancer');
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fecha_entrevista_sugerida) {
      setError('Debes seleccionar una fecha y hora para la entrevista');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData = {
        id_postulacion: postulant.id_postulacion,
        tipo_solicitud: 'entrevista',
        fecha_entrevista_sugerida: formData.fecha_entrevista_sugerida,
        mensaje_solicitud: formData.mensaje_solicitud || null
      };

      await createContactRequest(requestData);
      setSuccess('✅ Solicitud de entrevista enviada exitosamente');

      setTimeout(() => {
        onClose();
        setSuccess('');
        setFormData({ fecha_entrevista_sugerida: '', mensaje_solicitud: '' });
      }, 2000);

    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      setError(err.response?.data?.error || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-[#07767c]" size={28} />
            Solicitud de Entrevista
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Info del freelancer */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Solicitar entrevista con:</p>
          <p className="text-lg font-semibold text-gray-900">{postulant?.nombre}</p>
          <p className="text-sm text-gray-500">{postulant?.titulo_profesional}</p>
        </div>

        {/* Disponibilidad del freelancer */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={20} className="text-[#07767c]" />
            Disponibilidad del Freelancer
          </h4>
          
          {loadingAvailability ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-[#07767c] animate-spin" />
            </div>
          ) : availability.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                Este freelancer aún no ha configurado su disponibilidad.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availability.map((slot, index) => (
                <div 
                  key={index}
                  className="p-3 bg-[#07767c]/5 border border-[#07767c]/20 rounded-lg"
                >
                  <p className="font-semibold text-[#07767c]">
                    {diasSemana[slot.dia_semana] || slot.dia_semana}
                  </p>
                  <p className="text-sm text-gray-600">
                    {slot.hora_inicio.substring(0, 5)} - {slot.hora_fin.substring(0, 5)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha y hora sugerida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha y hora sugerida *
            </label>
            <input
              type="datetime-local"
              value={formData.fecha_entrevista_sugerida}
              onChange={(e) => setFormData({ ...formData, fecha_entrevista_sugerida: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent"
              required
              min={new Date().toISOString().slice(0, 16)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Intenta elegir un horario dentro de la disponibilidad del freelancer
            </p>
          </div>

          {/* Mensaje opcional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje (opcional)
            </label>
            <textarea
              value={formData.mensaje_solicitud}
              onChange={(e) => setFormData({ ...formData, mensaje_solicitud: e.target.value })}
              placeholder="Escribe un mensaje para el freelancer..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          {/* Mensajes de error/éxito */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-lg hover:from-[#055a5f] hover:to-[#077d84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Enviar Solicitud
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewRequestModal;