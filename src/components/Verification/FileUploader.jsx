import React, { useState } from 'react';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const FileUploader = ({ label, tipoDocumento, onUploadSuccess, helpText, helpLink }) => {
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Solo se aceptan archivos JPG, PNG o PDF');
      setStatus('error');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('El archivo no debe superar los 5MB');
      setStatus('error');
      return;
    }

    setFileName(file.name);
    setStatus('uploading');
    setErrorMessage('');

    try {
      await onUploadSuccess(file, tipoDocumento);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Error al subir el archivo');
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 hover:border-[#07767c] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {label}
            {helpText && (
              <span className="text-xs text-gray-500 font-normal ml-2">({helpText})</span>
            )}
          </label>
          {helpLink && (
            <a
              href={helpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#07767c] hover:underline"
            >
              ¿Cómo obtener este documento?
            </a>
          )}
        </div>
        {status === 'success' && <CheckCircle className="text-green-500" size={20} />}
        {status === 'error' && <XCircle className="text-red-500" size={20} />}
      </div>

      <div className="relative">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          disabled={status === 'uploading' || status === 'success'}
          className="hidden"
          id={`file-${tipoDocumento}`}
        />
        <label
          htmlFor={`file-${tipoDocumento}`}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
            status === 'success'
              ? 'bg-green-50 border-green-300 cursor-not-allowed'
              : status === 'uploading'
              ? 'bg-gray-100 border-gray-300 cursor-wait'
              : 'bg-white border-gray-300 hover:border-[#07767c] hover:bg-gray-50'
          }`}
        >
          {status === 'uploading' ? (
            <>
              <Loader2 className="animate-spin text-[#07767c]" size={20} />
              <span className="text-sm text-gray-600">Subiendo...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-sm text-green-700 font-medium">
                {fileName || 'Archivo subido'}
              </span>
            </>
          ) : (
            <>
              <Upload className="text-gray-400" size={20} />
              <span className="text-sm text-gray-600">
                Haz clic para seleccionar archivo
              </span>
            </>
          )}
        </label>
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <XCircle size={14} />
          {errorMessage}
        </p>
      )}
      
      {status === 'success' && (
        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
          <CheckCircle size={14} />
          Documento subido exitosamente
        </p>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Formatos aceptados: JPG, PNG, PDF (máx. 5MB)
      </p>
    </div>
  );
};

export default FileUploader;