import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDocuments, uploadVerificationDocs } from '@/api/verificationApi';
import { useAuth } from '@/hooks';
import DocumentUploader from '@/components/Verification/DocumentUploader';
import MainLayout from '@/components/Layouts/MainLayout';
import { CheckCircle, AlertCircle, Loader2, Send, FileCheck } from 'lucide-react';

const VerificarDocumentosPage = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useAuth();
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      const docs = await getMyDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error cargando documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async () => {
    setUploading(false);
    await loadDocuments();

    await refetchUser();

    alert('✅ Documentos subidos exitosamente. Tu cuenta está en revisión.');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-[#07767c]" size={48} />
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
                <FileCheck className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Verificación de Identidad</h1>
                <p className="text-gray-600">
                  {user?.estado_verificacion === 'rechazado' 
                    ? 'Algunos documentos fueron rechazados. Revisa los comentarios y vuelve a subirlos.'
                    : 'Sube los documentos requeridos para verificar tu cuenta'
                  }
                </p>
              </div>
            </div>

            {/* Estado actual */}
            {user?.estado_verificacion === 'en_revision' && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-blue-600" size={20} />
                  <p className="text-sm text-blue-800 font-medium">
                    Tus documentos están en revisión. Te notificaremos cuando sean aprobados.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Document Uploader */}
          <DocumentUploader 
            tipoUsuario={user?.tipo_usuario}
            documentos={documents}
            onUploadComplete={handleUploadComplete}
            isUploading={uploading}
            setIsUploading={setUploading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default VerificarDocumentosPage;