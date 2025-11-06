import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { validateVerificationToken, submitForReview } from '@/api/verificationApi';
import DocumentUploader from '@/components/Verification/DocumentUploader';
import MainLayout from '@/components/Layouts/MainLayout';
import { CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';

const VerificarDocumentosPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('validating'); // validating, valid, invalid, submitting, submitted
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setError('Token no proporcionado en la URL');
      return;
    }

    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const data = await validateVerificationToken(token);
      
      // Guardar JWT temporal en sessionStorage
      sessionStorage.setItem('token', data.token);
      
      setUserData(data.user);
      setStatus('valid');
    } catch (error) {
      setStatus('invalid');
      setError(error.error || 'Token inválido o expirado');
    }
  };

  const handleSubmitForReview = async () => {
    setStatus('submitting');
    try {
      await submitForReview();
      setStatus('submitted');
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/?verification=pending');
      }, 3000);
    } catch (error) {
      alert(error.error || 'Error al enviar documentos');
      setStatus('valid');
    }
  };

  if (status === 'validating') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <Loader2 className="animate-spin text-[#07767c] mb-4" size={48} />
          <p className="text-gray-600 font-medium">Validando enlace...</p>
        </div>
      </MainLayout>
    );
  }

  if (status === 'invalid') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Enlace Inválido</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#07767c] text-white rounded-lg hover:bg-[#055a5f] transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (status === 'submitted') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Documentos Enviados!</h2>
            <p className="text-gray-600 mb-4">
              Tus documentos han sido enviados a revisión. Te notificaremos cuando sean aprobados.
            </p>
            <p className="text-sm text-gray-500">Redirigiendo al inicio...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-[#07767c] to-[#055a5f] p-4 rounded-full">
                <CheckCircle className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Verificación de Identidad</h1>
                <p className="text-gray-600">
                  Hola, <span className="font-semibold">{userData?.correo}</span>
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                Para poder usar Busquidy, necesitamos verificar tu identidad. Por favor, sube los documentos requeridos según tu tipo de cuenta.
              </p>
            </div>
          </div>

          {/* Document Uploader */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <DocumentUploader tipoUsuario={userData?.tipo_usuario} />
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={handleSubmitForReview}
              disabled={status === 'submitting'}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white font-semibold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar a Revisión
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Al enviar, aceptas que revisemos tus documentos para verificar tu identidad
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VerificarDocumentosPage;