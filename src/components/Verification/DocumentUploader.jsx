import React, { useState, useEffect } from 'react';
import { uploadDocument, getUserDocuments } from '@/api/verificationApi';
import FileUploader from './FileUploader';
import { FileText, AlertCircle } from 'lucide-react';

const DocumentUploader = ({ tipoUsuario }) => {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDocuments();
  }, []);

  const loadUserDocuments = async () => {
    try {
      const docs = await getUserDocuments();
      const docsMap = {};
      docs.forEach(doc => {
        docsMap[doc.tipo_documento] = doc;
      });
      setUploadedDocs(docsMap);
    } catch (error) {
      console.error('Error cargando documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = async (file, tipoDocumento) => {
    await uploadDocument(file, tipoDocumento);
    await loadUserDocuments();
  };

  const renderDocumentsByType = () => {
    switch (tipoUsuario) {
      case 'freelancer':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start gap-2">
                <FileText className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-blue-900">Documentos para Freelancers</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Como freelancer, necesitas verificar tu identidad como estudiante activo.
                  </p>
                </div>
              </div>
            </div>

            <FileUploader
              label="DNI - Lado Frontal"
              tipoDocumento="dni_frente"
              onUploadSuccess={handleUploadSuccess}
              helpText="Foto clara y legible"
            />

            <FileUploader
              label="DNI - Lado Reverso"
              tipoDocumento="dni_reverso"
              onUploadSuccess={handleUploadSuccess}
              helpText="Foto clara y legible"
            />

            <FileUploader
              label="Certificado de Alumno Regular"
              tipoDocumento="certificado_alumno"
              onUploadSuccess={handleUploadSuccess}
              helpText="Debe estar vigente"
              helpLink="https://portal.uc.cl/certificados"
            />

            <FileUploader
              label="Certificado de Antecedentes (Opcional)"
              tipoDocumento="antecedentes"
              onUploadSuccess={handleUploadSuccess}
              helpText="Recomendado para mayor confianza"
              helpLink="https://www.chileatiende.gob.cl/fichas/3442-certificado-de-antecedentes"
            />
          </div>
        );

      case 'empresa_natural':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex items-start gap-2">
                <FileText className="text-green-600 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-green-900">Documentos para Persona Natural</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Verifica tu identidad como empleador persona natural.
                  </p>
                </div>
              </div>
            </div>

            <FileUploader
              label="DNI - Lado Frontal"
              tipoDocumento="dni_frente"
              onUploadSuccess={handleUploadSuccess}
              helpText="Foto clara y legible"
            />

            <FileUploader
              label="DNI - Lado Reverso"
              tipoDocumento="dni_reverso"
              onUploadSuccess={handleUploadSuccess}
              helpText="Foto clara y legible"
            />

            <FileUploader
              label="Certificado de Antecedentes"
              tipoDocumento="antecedentes"
              onUploadSuccess={handleUploadSuccess}
              helpLink="https://www.chileatiende.gob.cl/fichas/3442-certificado-de-antecedentes"
            />
          </div>
        );

      case 'empresa_juridico':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <div className="flex items-start gap-2">
                <FileText className="text-purple-600 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-purple-900">Documentos para Empresa Jurídica</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Verifica la legalidad de tu empresa.
                  </p>
                </div>
              </div>
            </div>

            <FileUploader
              label="Escritura de Constitución o Certificado de Vigencia"
              tipoDocumento="constitucion_empresa"
              onUploadSuccess={handleUploadSuccess}
              helpText="Documento oficial del Registro Civil"
            />

            <FileUploader
              label="Certificado de Inicio de Actividades (SII)"
              tipoDocumento="inicio_actividades_sii"
              onUploadSuccess={handleUploadSuccess}
              helpText="Emitido por el Servicio de Impuestos Internos"
              helpLink="https://www.sii.cl"
            />
          </div>
        );

      default:
        return (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800">Tipo de usuario no reconocido</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07767c]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {renderDocumentsByType()}
    </div>
  );
};

export default DocumentUploader;