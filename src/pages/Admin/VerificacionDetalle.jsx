import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getUserVerificationDetails, 
  approveUser, 
  rejectUser, 
} from '@/api/adminApi';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Download,
  AlertCircle,
  User,
  Mail,
  Calendar
} from 'lucide-react';

const VerificacionDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  const loadUserDetails = async () => {
    try {
      const data = await getUserVerificationDetails(id);
      setUserData(data.user);
      setDocuments(data.documents);
    } catch (error) {
      console.error('Error cargando detalles:', error);
      alert('Error al cargar los detalles del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('¿Estás seguro de aprobar esta verificación?')) return;

    setProcessing(true);
    try {
      await approveUser(parseInt(id));
      alert('✅ Usuario aprobado exitosamente');
      navigate('/adminhome/verificaciones');
    } catch (error) {
      alert('Error al aprobar: ' + (error.message || 'Error desconocido'));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Por favor, proporciona un motivo del rechazo');
      return;
    }

    setProcessing(true);
    try {
      // Crear el objeto con comentarios para todos los documentos
      const rejectData = {
        documentos: documents.map(doc => ({
          id_documento: doc.id_documento,
          comentario: rejectReason // Mismo comentario para todos
        }))
      };

      await rejectUser(parseInt(id), rejectData);
      alert('❌ Usuario rechazado');
      navigate('/adminhome/verificaciones');
    } catch (error) {
      alert('Error al rechazar: ' + (error.message || 'Error desconocido'));
    } finally {
      setProcessing(false);
      setShowRejectModal(false);
    }
  };

  const getDocumentLabel = (tipo) => {
    const labels = {
      dni_frente: 'DNI (Frente)',
      dni_reverso: 'DNI (Reverso)',
      certificado_alumno: 'Certificado de Alumno Regular',
      antecedentes: 'Certificado de Antecedentes',
      constitucion_empresa: 'Escritura de Constitución',
      inicio_actividades_sii: 'Inicio de Actividades SII'
    };
    return labels[tipo] || tipo;
  };

  const getTipoUsuarioLabel = (tipo) => {
    const labels = {
      freelancer: 'Freelancer (Estudiante)',
      empresa_natural: 'Empresa Persona Natural',
      empresa_juridico: 'Empresa Jurídica'
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07767c]"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-red-800 font-medium">Usuario no encontrado</p>
          <button
            onClick={() => navigate('/adminhome/verificaciones')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/adminhome/verificaciones')}
        className="flex items-center gap-2 text-gray-600 hover:text-[#07767c] mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={20} />
        Volver a Verificaciones
      </button>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#07767c] to-[#055a5f] w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.correo?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Verificación de Usuario
              </h1>
              <p className="text-gray-600">Revisión de documentos de identidad</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="text-[#07767c]" size={24} />
            <div>
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <p className="font-semibold text-gray-800">{userData.correo}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <User className="text-[#07767c]" size={24} />
            <div>
              <p className="text-xs text-gray-500 font-medium">Tipo de Usuario</p>
              <p className="font-semibold text-gray-800">
                {getTipoUsuarioLabel(userData.tipo_usuario)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="text-[#07767c]" size={24} />
            <div>
              <p className="text-xs text-gray-500 font-medium">ID Usuario</p>
              <p className="font-semibold text-gray-800">#{userData.id_usuario}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="text-[#07767c]" />
          Documentos Subidos
        </h2>

        {documents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500">No hay documentos subidos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#07767c] transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#07767c] p-2 rounded-lg">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {getDocumentLabel(doc.tipo_documento)}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {doc.tipo_documento}
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={doc.url_documento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  <Download size={18} />
                  Ver Documento
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Acciones de Verificación</h3>
        
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            disabled={processing || documents.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={20} />
            {processing ? 'Procesando...' : 'Aprobar Usuario'}
          </button>

          <button
            onClick={() => setShowRejectModal(true)}
            disabled={processing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={20} />
            Rechazar Usuario
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Asegúrate de revisar todos los documentos antes de tomar una decisión
        </p>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Rechazar Verificación</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Por favor, proporciona un motivo del rechazo. Este mensaje será enviado al usuario.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ejemplo: Los documentos no son legibles, falta el certificado de alumno regular..."
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={processing}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectReason.trim()}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Rechazando...' : 'Confirmar Rechazo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificacionDetalle;