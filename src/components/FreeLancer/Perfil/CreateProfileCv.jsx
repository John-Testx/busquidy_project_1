import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { uploadCV } from "../../../api/freelancerApi";

function CreateProfileCv({ id_usuario }) {
  const [cvFile, setCvFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setErrorMessage("Solo se aceptan archivos PDF, DOC o DOCX");
        setCvFile(null);
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage("El archivo no debe superar 5MB");
        setCvFile(null);
        return;
      }

      setCvFile(file);
      setErrorMessage("");
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!cvFile) {
      setErrorMessage("Por favor selecciona un archivo CV");
      return;
    }

    if (!id_usuario) {
      setErrorMessage("Error: ID de usuario no disponible");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await uploadCV(cvFile, id_usuario);
      setUploadStatus("success");
      setCvFile(null);
      
      // Esperar 2 segundos antes de recargar
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(
        error.message || "Error al subir el CV. Por favor intenta nuevamente."
      );
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setCvFile(null);
    setErrorMessage("");
    setUploadStatus(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <FileText className="text-indigo-600" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sube tu CV</h2>
        <p className="text-gray-600">
          Carga tu CV en formato PDF o Word. Los reclutadores podrán revisarlo y
          contactarte si hay oportunidades disponibles.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
        {uploadStatus === "success" ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¡CV subido exitosamente!
            </h3>
            <p className="text-gray-600 mb-4">
              Tu CV ha sido procesado. Los reclutadores ya pueden verlo en tu perfil.
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
              <span className="font-medium">Redirigiendo...</span>
            </div>
          </div>
        ) : (
          <>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer bg-gray-50 mb-6"
              onClick={() => document.getElementById("cv-input").click()}
            >
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Arrastra tu CV aquí
              </h3>
              <p className="text-gray-600 mb-4">o haz clic para seleccionar</p>
              <p className="text-sm text-gray-500">
                Formatos aceptados: PDF, DOC, DOCX (máx. 5MB)
              </p>
              <input
                id="cv-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {cvFile && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{cvFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <X className="text-gray-600" size={20} />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!cvFile || isLoading}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                !cvFile || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white cursor-pointer shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Subir CV
                </>
              )}
            </button>
          </>
        )}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-3">Consejos para tu CV</h3>
        <ul className="space-y-2 text-sm text-indigo-800">
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            Asegúrate de que tu CV esté actualizado y sea fácil de leer
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            Incluye experiencia relevante y habilidades clave
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            Usa un formato profesional y bien organizado
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            No olvides tus datos de contacto y referencias
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CreateProfileCv;