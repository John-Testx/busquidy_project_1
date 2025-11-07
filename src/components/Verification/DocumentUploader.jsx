import React, { useState } from 'react';
import { uploadVerificationDocs } from '@/api/verificationApi';
import FileUploader from './FileUploader';
import { FileText, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const DocumentUploader = ({ tipoUsuario, documentos, onUploadComplete, isUploading, setIsUploading }) => {
  const [selectedFiles, setSelectedFiles] = useState({}); // { tipo_documento: File }

  // Definir documentos requeridos según tipo de usuario
  const getRequiredDocuments = () => {
    switch (tipoUsuario) {
      case 'freelancer':
        return [
          { tipo: 'dni_frente', label: 'DNI - Frente', required: true },
          { tipo: 'dni_reverso', label: 'DNI - Reverso', required: true },
          { tipo: 'certificado_alumno', label: 'Certificado de Alumno Regular', required: true },
          { tipo: 'antecedentes', label: 'Certificado de Antecedentes', required: false },
        ];
      case 'empresa_natural':
        return [
          { tipo: 'dni_frente', label: 'DNI - Frente', required: true },
          { tipo: 'dni_reverso', label: 'DNI - Reverso', required: true },
          { tipo: 'inicio_actividades_sii', label: 'Inicio de Actividades SII', required: true },
        ];
      case 'empresa_juridico':
        return [
          { tipo: 'constitucion_empresa', label: 'Escritura de Constitución', required: true },
          { tipo: 'dni_representante_frente', label: 'DNI Representante - Frente', required: true },
          { tipo: 'dni_representante_reverso', label: 'DNI Representante - Reverso', required: true },
        ];
      default:
        return [];
    }
  };

  const requiredDocs = getRequiredDocuments();

  const handleFileSelect = (tipo, file) => {
    setSelectedFiles(prev => ({
      ...prev,
      [tipo]: file
    }));
  };

  const handleSubmit = async () => {
    // ✅ Validar considerando documentos ya subidos Y nuevos archivos seleccionados
    const missingDocs = requiredDocs.filter(doc => {
      if (!doc.required) return false;
      
      // Verificar si ya existe un documento subido previamente
      const existingDoc = documentos?.find(d => d.tipo_documento === doc.tipo);
      const hasExistingDoc = existingDoc && existingDoc.url_documento;
      
      // Verificar si hay un nuevo archivo seleccionado
      const hasNewFile = selectedFiles[doc.tipo];
      
      // Falta si NO tiene documento existente Y NO tiene nuevo archivo
      return !hasExistingDoc && !hasNewFile;
    }).map(doc => doc.label);

    if (missingDocs.length > 0) {
      alert(`Faltan documentos obligatorios:\n- ${missingDocs.join('\n- ')}`);
      return;
    }

    // ✅ Si no hay archivos nuevos seleccionados, no hacer nada
    if (Object.keys(selectedFiles).length === 0) {
      alert('No hay documentos nuevos para subir. Tus documentos ya fueron enviados previamente.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      const tiposArray = [];

      // Agregar archivos y tipos al FormData
      Object.entries(selectedFiles).forEach(([tipo, file]) => {
        if (file) {
          formData.append('documentos', file);
          tiposArray.push(tipo);
        }
      });

      // Agregar tipos como array de strings
      tiposArray.forEach(tipo => {
        formData.append('tiposDocumentos[]', tipo);
      });

      await uploadVerificationDocs(formData);
      
      // Limpiar archivos seleccionados
      setSelectedFiles({});
      
      onUploadComplete();
    } catch (error) {
      alert('Error al subir documentos: ' + (error.error || error.message));
      setIsUploading(false);
    }
  };

  const getDocumentStatus = (tipo) => {
    return documentos?.find(doc => doc.tipo_documento === tipo);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
      {/* Información según tipo de usuario */}
      <div className={`border-l-4 p-4 rounded ${
        tipoUsuario === 'freelancer' ? 'bg-blue-50 border-blue-500' :
        tipoUsuario === 'empresa_natural' ? 'bg-green-50 border-green-500' :
        'bg-purple-50 border-purple-500'
      }`}>
        <div className="flex items-start gap-2">
          <FileText className={
            tipoUsuario === 'freelancer' ? 'text-blue-600' :
            tipoUsuario === 'empresa_natural' ? 'text-green-600' :
            'text-purple-600'
          } size={20} />
          <div>
            <h4 className="font-semibold text-gray-900">
              {tipoUsuario === 'freelancer' && 'Documentos para Freelancers'}
              {tipoUsuario === 'empresa_natural' && 'Documentos para Persona Natural'}
              {tipoUsuario === 'empresa_juridico' && 'Documentos para Empresa Jurídica'}
            </h4>
            <p className="text-sm text-gray-700 mt-1">
              {tipoUsuario === 'freelancer' && 'Verifica tu identidad como estudiante activo.'}
              {tipoUsuario === 'empresa_natural' && 'Verifica tu identidad como empleador persona natural.'}
              {tipoUsuario === 'empresa_juridico' && 'Verifica la legalidad de tu empresa.'}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="space-y-4">
        {requiredDocs.map((doc) => {
          const status = getDocumentStatus(doc.tipo);
          return (
            <FileUploader
              key={doc.tipo}
              label={doc.label}
              tipoDocumento={doc.tipo}
              required={doc.required}
              documentStatus={status}
              onFileSelect={(file) => handleFileSelect(doc.tipo, file)}
              disabled={isUploading}
            />
          );
        })}
      </div>

      {/* Botón de envío */}
      <div className="pt-4 border-t">
        {/* Mostrar estado de documentos */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Estado de documentos:</h4>
          <div className="space-y-1">
            {requiredDocs.map(doc => {
              const existingDoc = documentos?.find(d => d.tipo_documento === doc.tipo);
              const hasFile = selectedFiles[doc.tipo];
              const hasExisting = existingDoc && existingDoc.url_documento;
              
              return (
                <div key={doc.tipo} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{doc.label}:</span>
                  <span className={`font-semibold ${
                    hasFile ? 'text-blue-600' :
                    hasExisting ? 'text-green-600' :
                    doc.required ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    {hasFile ? '📎 Nuevo archivo seleccionado' :
                     hasExisting ? '✅ Ya subido' :
                     doc.required ? '❌ Falta' : '⚪ Opcional'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white font-semibold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Subiendo Documentos...
            </>
          ) : (
            <>
              <Send size={20} />
              {Object.keys(selectedFiles).length > 0 
                ? `Subir ${Object.keys(selectedFiles).length} Documento(s) Nuevo(s)`
                : 'Enviar Documentos a Revisión'
              }
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          {Object.keys(selectedFiles).length > 0 
            ? 'Se subirán los nuevos documentos seleccionados'
            : 'Selecciona archivos nuevos o confirma los documentos ya subidos'
          }
        </p>
      </div>
    </div>
  );
};

export default DocumentUploader;