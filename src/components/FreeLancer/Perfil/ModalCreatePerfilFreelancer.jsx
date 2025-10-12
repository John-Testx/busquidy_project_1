import React, { useState } from "react";
import Select from "react-select";
import { X, ChevronLeft, ChevronRight, Check, CheckCircle, ImageOff } from "lucide-react";
import { initialFreelancerData } from "../../../common/consts";
import { createFreelancerProfile } from "../../../api/freelancerApi";

// Componentes de cada paso
import StepPresentacion from "./Sections/stepPresentacion";
import StepDatosPersonales from "./Sections/stepDatosPersonales";
import StepInclusionLaboral from "./Sections/StepInclusionLaboral";
import StepEmprendimiento from "./Sections/StepEmprendimiento";
import StepExperiencia from "./Sections/StepExperiencia";
import StepNivelEducacional from "./Sections/StepNivelEducacional";
import StepEducacionSuperior from "./Sections/StepEducacionSuperior";
import StepEducacionBasica from "./Sections/StepEducacionBasica";
import StepIdiomas from "./Sections/StepIdiomas";
import StepHabilidades from "./Sections/StepHabilidades";
import StepCursos from "./Sections/StepCursos";
import StepPretensiones from "./Sections/StepPretensiones";

const TOTAL_STEPS = 12;

const STEP_TITLES = {
  1: "Presentación",
  2: "Datos Personales",
  3: "Inclusión Laboral",
  4: "Emprendimiento",
  5: "Experiencia Laboral",
  6: "Nivel Educacional",
  7: "Educación Superior",
  8: "Educación Básica/Media",
  9: "Idiomas",
  10: "Habilidades",
  11: "Cursos y Certificaciones",
  12: "Pretensiones Laborales",
};

function ModalCreatePerfilFreelancer({ closeModal, id_usuario }) {
  const [freelancerData, setFreelancerData] = useState(initialFreelancerData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ============================================
  // HANDLERS GENERALES
  // ============================================
  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    setFreelancerData((prevData) => {
      if (Array.isArray(prevData[section])) {
        const newSection = [...prevData[section]];
        newSection[index][name] = value;
        return { ...prevData, [section]: newSection };
      } else {
        return {
          ...prevData,
          [section]: { ...prevData[section], [name]: value },
        };
      }
    });
  };

  const handleSelectChange = (option, section, field, index = null) => {
    setFreelancerData((prevData) => {
      if (Array.isArray(prevData[section])) {
        const newSection = [...prevData[section]];
        newSection[index][field] = option.value;
        return { ...prevData, [section]: newSection };
      } else {
        return {
          ...prevData,
          [section]: { ...prevData[section], [field]: option.value },
        };
      }
    });
  };

  // ============================================
  // VALIDACIONES
  // ============================================
  const validateStep = () => {
    let isValid = true;
    let error = "";

    switch (currentStep) {
      case 1:
        if (!freelancerData.freelancer.descripcion_freelancer?.trim()) {
          error = "Por favor completa tu descripción.";
          isValid = false;
        } else if (!freelancerData.freelancer.correo_contacto?.trim()) {
          error = "Por favor ingresa tu correo de contacto.";
          isValid = false;
        } else if (!freelancerData.freelancer.telefono_contacto?.trim()) {
          error = "Por favor ingresa tu teléfono de contacto.";
          isValid = false;
        }
        break;

      case 2:
        const ap = freelancerData.antecedentes_personales;
        if (!ap.nombres || !ap.apellidos || !ap.fecha_nacimiento ||
            !ap.identificacion || !ap.nacionalidad || !ap.ciudad_freelancer ||
            !ap.comuna || !ap.estado_civil) {
          error = "Por favor completa todos los campos obligatorios.";
          isValid = false;
        }
        break;

      case 3:
        if (!freelancerData.inclusion_laboral.discapacidad) {
          error = "Por favor indica si tienes discapacidad o no.";
          isValid = false;
        }
        break;

      case 4:
        if (!freelancerData.emprendimiento.emprendedor) {
          error = "Por favor indica si eres emprendedor o no.";
          isValid = false;
        }
        break;

      case 5:
        if (!freelancerData.trabajo_practica.experiencia_laboral) {
          error = "Por favor indica si tienes experiencia laboral o no.";
          isValid = false;
        }
        break;

      case 6:
        if (!freelancerData.nivel_educacional.nivel_academico || 
            !freelancerData.nivel_educacional.estado_educacional) {
          error = "Por favor completa todos los campos.";
          isValid = false;
        }
        break;

      case 7:
        const es = freelancerData.educacion_superior;
        if (!es.institucion_superior || !es.carrera || !es.carrera_afin ||
            !es.estado_superior || !es.ano_inicio_superior || !es.ano_termino_superior) {
          error = "Por favor completa todos los campos.";
          isValid = false;
        }
        break;

      case 8:
        const eb = freelancerData.educacion_basica_media;
        if (!eb.institucion_basica_media || !eb.tipo || !eb.pais ||
            !eb.ciudad_basica_media || !eb.ano_inicio_basica_media || 
            !eb.ano_termino_basica_media) {
          error = "Por favor completa todos los campos.";
          isValid = false;
        }
        break;

      case 12:
        if (!freelancerData.pretensiones.disponibilidad || 
            !freelancerData.pretensiones.renta_esperada) {
          error = "Por favor completa todos los campos.";
          isValid = false;
        }
        break;

      default:
        isValid = true;
    }

    setErrorMessage(error);
    return isValid;
  };

  // ============================================
  // NAVEGACIÓN
  // ============================================
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      setErrorMessage("");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrorMessage("");
  };

  // ============================================
  // SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createFreelancerProfile(freelancerData, id_usuario);
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      
      // Esperar 2 segundos y recargar
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Error al crear el perfil:", error);
      setErrorMessage(error.message || "Error al crear el perfil. Intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  // ============================================
  // RENDER DE PASOS
  // ============================================
  const renderStep = () => {
    const commonProps = {
      freelancerData,
      handleChange,
      handleSelectChange,
      setFreelancerData,
    };

    switch (currentStep) {
      case 1:
        return <StepPresentacion {...commonProps} />;
      case 2:
        return <StepDatosPersonales {...commonProps} />;
      case 3:
        return <StepInclusionLaboral {...commonProps} />;
      case 4:
        return <StepEmprendimiento {...commonProps} />;
      case 5:
        return <StepExperiencia {...commonProps} />;
      case 6:
        return <StepNivelEducacional {...commonProps} />;
      case 7:
        return <StepEducacionSuperior {...commonProps} />;
      case 8:
        return <StepEducacionBasica {...commonProps} />;
      case 9:
        return <StepIdiomas {...commonProps} />;
      case 10:
        return <StepHabilidades {...commonProps} />;
      case 11:
        return <StepCursos {...commonProps} />;
      case 12:
        return <StepPretensiones {...commonProps} />;
      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={48} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Perfil Creado!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu perfil profesional ha sido creado exitosamente. Los reclutadores ya pueden encontrarte.
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
              <span className="font-medium">Redirigiendo...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Crear Perfil Freelancer</h2>
            <p className="text-blue-100 text-sm mt-1">
              Paso {currentStep} de {TOTAL_STEPS}: {STEP_TITLES[currentStep]}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">{renderStep()}</div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Anterior
                </button>
              )}

              {currentStep < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Crear Perfil
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCreatePerfilFreelancer;