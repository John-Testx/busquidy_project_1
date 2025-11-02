import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { uploadCV } from "@/api/freelancerApi";

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-2xl mb-6 shadow-lg">
            <FileText className="text-white" size={40} />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Sube tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07767c] to-[#40E0D0]">Currículum</span>
          </h2>
          <p className="text-xl text-gray-600">
            Carga tu CV en formato PDF o Word. Los reclutadores podrán revisarlo y contactarte si hay oportunidades disponibles.
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8 mb-8">
          {uploadStatus === "success" ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="text-green-600" size={40} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                ¡CV subido exitosamente!
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Tu CV ha sido procesado. Los reclutadores ya pueden verlo en tu perfil.
              </p>
              <div className="flex items-center justify-center gap-3 text-[#07767c]">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#07767c] border-t-transparent" />
                <span className="font-semibold text-lg">Redirigiendo...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Zona de drop */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#07767c] hover:bg-[#07767c]/5 transition-all duration-300 cursor-pointer bg-gray-50 mb-6 group"
                onClick={() => document.getElementById("cv-input").click()}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#07767c]/10 rounded-2xl mb-6 group-hover:bg-[#07767c]/20 transition-colors">
                  <Upload className="text-[#07767c] group-hover:scale-110 transition-transform" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Arrastra tu CV aquí
                </h3>
                <p className="text-gray-600 text-lg mb-4">o haz clic para seleccionar</p>
                <p className="text-sm text-gray-500">
                  Formatos aceptados: <span className="font-semibold">PDF, DOC, DOCX</span> (máx. 5MB)
                </p>
                <input
                  id="cv-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Archivo seleccionado */}
              {cvFile && (
                <div className="bg-gradient-to-r from-[#07767c]/10 to-[#40E0D0]/10 border-2 border-[#07767c]/30 rounded-xl p-5 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#07767c] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{cvFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                  >
                    <X className="text-gray-600 group-hover:text-red-600" size={24} />
                  </button>
                </div>
              )}

              {/* Error */}
              {errorMessage && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                  <p className="text-red-700 font-medium">{errorMessage}</p>
                </div>
              )}

              {/* Botón de subir */}
              <button
                onClick={handleUpload}
                disabled={!cvFile || isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  !cvFile || isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#07767c] to-[#40E0D0] hover:from-[#05595d] hover:to-[#07767c] text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    Subir CV
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Consejos */}
        <div className="bg-gradient-to-r from-[#07767c]/10 to-[#40E0D0]/10 border-2 border-[#07767c]/30 rounded-2xl p-8">
          <h3 className="font-bold text-[#07767c] text-xl mb-5 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Consejos para tu CV
          </h3>
          <div className="space-y-3 text-gray-700">
            {[
              'Asegúrate de que tu CV esté actualizado y sea fácil de leer',
              'Incluye experiencia relevante y habilidades clave',
              'Usa un formato profesional y bien organizado',
              'No olvides tus datos de contacto y referencias'
            ].map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#07767c] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProfileCv;