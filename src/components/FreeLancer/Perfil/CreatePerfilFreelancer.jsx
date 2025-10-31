import React, { useState } from "react";
import ModalCreatePerfilFreelancer from "./ModalCreatePerfilFreelancer";
import { FileText, AlertCircle } from "lucide-react";

function CreatePerfilFreelancer({ userType, id_usuario }) {
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleOpenModal = () => {
    if (userType === "freelancer") {
      setShowModal(true);
    } else {
      
      // AQUÍ ESTÁ EL CAMBIO
      const isEmpresa = userType === "empresa" || userType === "empresa_juridico" || userType === "empresa_natural";

      setAlertMessage(
        isEmpresa
          ? "Esta función es exclusiva para usuarios de tipo Freelancer."
          : "Debes iniciar sesión como Freelancer para crear tu perfil." // Esto se aplica a usuarios no logueados o administradores
      );
      setShowAlert(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <FileText className="text-teal-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crea tu Perfil Profesional
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Completa tu perfil para que las empresas conozcan más sobre ti, tus habilidades y experiencia.
          </p>
        </div>

        {showAlert && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Acceso restringido</h3>
              <p className="text-red-700 text-sm">{alertMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "📋",
              title: "Información Completa",
              description: "Datos personales, educación y experiencia",
            },
            {
              icon: "💼",
              title: "Demuestra tu Experiencia",
              description: "Habilidades, idiomas y certificaciones",
            },
            {
              icon: "🎯",
              title: "Mayor Visibilidad",
              description: "Sé encontrado por empresas que buscan talento",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-teal-300 transition-all"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleOpenModal}
            disabled={userType !== "freelancer"}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              userType === "freelancer"
                ? "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white cursor-pointer shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {userType === "freelancer"
              ? "Comenzar a Crear Perfil"
              : "Acceso restringido"}
          </button>
        </div>

        <div className="mt-16 bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Pasos del proceso
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "1", label: "Presentación", icon: "👋" },
              { num: "2", label: "Datos Personales", icon: "📝" },
              { num: "3", label: "Educación", icon: "🎓" },
              { num: "4", label: "Experiencia", icon: "💼" },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 text-white rounded-full font-bold text-xl mb-3 mx-auto shadow-lg">
                  {step.icon}
                </div>
                <p className="text-sm font-medium text-gray-700">{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-teal-50 border border-teal-200 rounded-lg p-6">
          <h3 className="font-semibold text-teal-900 mb-2">💡 Consejo</h3>
          <p className="text-teal-800 text-sm">
            Completa todos los pasos del formulario para aumentar tus posibilidades de ser
            contactado por empresas. Un perfil completo genera más confianza.
          </p>
        </div>
      </div>

      {showModal && (
        <ModalCreatePerfilFreelancer
          closeModal={() => setShowModal(false)}
          id_usuario={id_usuario}
        />
      )}
    </div>
  );
}

export default CreatePerfilFreelancer;