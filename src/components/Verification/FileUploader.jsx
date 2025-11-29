import React, { useState } from 'react';
import { Upload, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

const FileUploader = ({ 
  label, 
  tipoDocumento, 
  required, 
  documentStatus, 
  onFileSelect, 
  disabled 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se aceptan archivos JPG, PNG o PDF');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    onFileSelect(file);
  };

  const getStatusColor = () => {
    if (documentStatus?.estado_documento === 'aprobado') return 'border-green-500 bg-green-50';
    if (documentStatus?.estado_documento === 'rechazado') return 'border-red-500 bg-red-50';
    if (documentStatus?.estado_documento === 'subido') return 'border-blue-500 bg-blue-50';
    return 'border-gray-300 bg-white';
  };

  const getStatusIcon = () => {
    if (documentStatus?.estado_documento === 'aprobado') {
      return <CheckCircle className="text-green-500" size={20} />;
    }
    if (documentStatus?.estado_documento === 'rechazado') {
      return <XCircle className="text-red-500" size={20} />;
    }
    if (documentStatus?.estado_documento === 'subido') {
      return <AlertCircle className="text-blue-500" size={20} />;
    }
    return null;
  };

  return (
    <div className={`border-2 rounded-lg p-4 transition-all ${getStatusColor()}`}>
      {/* Header con label y estado */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {documentStatus && (
            <p className="text-xs text-gray-600 mt-1">
              Estado: <span className="font-medium">{documentStatus.estado_documento}</span>
            </p>
          )}
        </div>
        {getStatusIcon()}
      </div>

      {/* Comentario de rechazo */}
      {documentStatus?.estado_documento === 'rechazado' && documentStatus?.comentario_rechazo && (
        <div className="mb-3 bg-red-100 border-l-4 border-red-500 p-3 rounded">
          <p className="text-xs font-semibold text-red-800 mb-1">Motivo del rechazo:</p>
          <p className="text-xs text-red-700">{documentStatus.comentario_rechazo}</p>
        </div>
      )}

      {/* Link al documento existente */}
      {documentStatus?.url_documento && (
        <a
          href={documentStatus.url_documento}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-[#07767c] hover:underline mb-3"
        >
          <ExternalLink size={14} />
          Ver documento subido anteriormente
        </a>
      )}

      {/* Input de archivo */}
      <div className="relative">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          id={`file-${tipoDocumento}`}
        />
        <label
          htmlFor={`file-${tipoDocumento}`}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
            disabled
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
              : selectedFile
              ? 'bg-green-50 border-green-300'
              : 'bg-white border-gray-300 hover:border-[#07767c] hover:bg-gray-50'
          }`}
        >
          {selectedFile ? (
            <>
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-sm text-green-700 font-medium truncate max-w-xs">
                {selectedFile.name}
              </span>
            </>
          ) : (
            <>
              <Upload className="text-gray-400" size={20} />
              <span className="text-sm text-gray-600">
                {documentStatus?.estado_documento === 'rechazado' 
                  ? 'Haz clic para volver a subir' 
                  : 'Haz clic para seleccionar archivo'
                }
              </span>
            </>
          )}
        </label>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <XCircle size={14} />
          {error}
        </p>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500 mt-2">
        Formatos: JPG, PNG, PDF (máx. 5MB)
      </p>
    </div>
  );
};

export default FileUploader;