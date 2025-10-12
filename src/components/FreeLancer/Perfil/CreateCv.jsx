import React, { useState } from "react";
import { FileText, User, Briefcase, GraduationCap, Lightbulb, Save, AlertCircle, CheckCircle } from "lucide-react";
import DatosPersonalesModal from "../DatosPersonalesModal";
import ExperienciaLaboralModal from "../ExperienciaLaboralModal";
import EducacionModal from "../EducacionModal";
import HabilidadesModal from "../HabilidadesModal";

function CreateCV({ cvData, onSave }) {
  const [localCvData, setLocalCvData] = useState(cvData || {
    datosPersonales: {},
    experiencia: [],
    educacion: [],
    habilidades: []
  });

  const [isDatosPersonalesOpen, setDatosPersonalesOpen] = useState(false);
  const [isExperienciaOpen, setExperienciaOpen] = useState(false);
  const [isEducacionOpen, setEducacionOpen] = useState(false);
  const [isHabilidadesOpen, setHabilidadesOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSectionUpdate = (section, data) => {
    setLocalCvData((prevData) => ({
      ...prevData,
      [section]: data
    }));
    setSaveStatus(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      await onSave(localCvData);
      setSaveStatus("success");
      
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error guardando CV:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {
      title: "Datos Personales",
      icon: User,
      color: "blue",
      description: "Información básica y de contacto",
      onClick: () => setDatosPersonalesOpen(true),
      completed: Object.keys(localCvData.datosPersonales).length > 0
    },
    {
      title: "Experiencia Laboral",
      icon: Briefcase,
      color: "green",
      description: "Historial de trabajos y prácticas",
      onClick: () => setExperienciaOpen(true),
      completed: localCvData.experiencia.length > 0
    },
    {
      title: "Educación",
      icon: GraduationCap,
      color: "purple",
      description: "Formación académica y certificados",
      onClick: () => setEducacionOpen(true),
      completed: localCvData.educacion.length > 0
    },
    {
      title: "Habilidades",
      icon: Lightbulb,
      color: "orange",
      description: "Competencias y destrezas",
      onClick: () => setHabilidadesOpen(true),
      completed: localCvData.habilidades.length > 0
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        hover: "hover:bg-blue-50",
        border: "border-blue-200"
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        hover: "hover:bg-green-50",
        border: "border-green-200"
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        hover: "hover:bg-purple-50",
        border: "border-purple-200"
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
        hover: "hover:bg-orange-50",
        border: "border-orange-200"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="text-blue-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Editar tu CV</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Completa cada sección de tu currículum para destacar tu perfil profesional
          </p>
        </div>

        {/* Status Messages */}
        {saveStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <p className="text-green-700 font-medium">¡CV guardado exitosamente!</p>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700 font-medium">Error al guardar. Intenta nuevamente.</p>
          </div>
        )}

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            const colors = getColorClasses(section.color);
            
            return (
              <button
                key={idx}
                onClick={section.onClick}
                className={`p-6 bg-white border-2 ${colors.border} rounded-xl hover:shadow-lg transition-all text-left relative overflow-hidden group ${colors.hover}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${colors.bg} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className={colors.text} size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                    
                    {section.completed && (
                      <div className="mt-3 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-green-600 text-xs font-medium">Completado</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform`} />
              </button>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Progreso del CV</h3>
            <span className="text-sm text-gray-600">
              {sections.filter(s => s.completed).length} de {sections.length} completadas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(sections.filter(s => s.completed).length / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white cursor-pointer"
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={24} />
                Guardar CV
              </>
            )}
          </button>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Consejos para tu CV</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              Mantén tu información actualizada y precisa
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              Destaca tus logros más relevantes en cada experiencia
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              Usa palabras clave relacionadas con tu industria
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              Revisa la ortografía y gramática antes de guardar
            </li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <DatosPersonalesModal
        isOpen={isDatosPersonalesOpen}
        onSave={(data) => {
          handleSectionUpdate('datosPersonales', data);
          setDatosPersonalesOpen(false);
        }}
        onClose={() => setDatosPersonalesOpen(false)}
        initialData={localCvData.datosPersonales}
      />

      <ExperienciaLaboralModal
        isOpen={isExperienciaOpen}
        onSave={(data) => {
          handleSectionUpdate('experiencia', data);
          setExperienciaOpen(false);
        }}
        onClose={() => setExperienciaOpen(false)}
        initialData={localCvData.experiencia}
      />

      <EducacionModal
        isOpen={isEducacionOpen}
        onSave={(data) => {
          handleSectionUpdate('educacion', data);
          setEducacionOpen(false);
        }}
        onClose={() => setEducacionOpen(false)}
        initialData={localCvData.educacion}
      />

      <HabilidadesModal
        isOpen={isHabilidadesOpen}
        onSave={(data) => {
          handleSectionUpdate('habilidades', data);
          setHabilidadesOpen(false);
        }}
        onClose={() => setHabilidadesOpen(false)}
        initialData={localCvData.habilidades}
      />
    </div>
  );
}

export default CreateCV;