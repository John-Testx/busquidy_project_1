import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Check, CheckCircle } from "lucide-react";
import { initialFreelancerData } from "@/common/consts";
import { createFreelancerProfile } from "@/api/freelancerApi";

// Componentes de cada paso
import StepPresentacion from "./Sections/StepPresentacion";
import StepDatosPersonales from "./Sections/StepDatosPersonales";
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
  const [completedSteps, setCompletedSteps] = useState([]);
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
      setCompletedSteps([...new Set([...completedSteps, currentStep])]);
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      setErrorMessage("");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrorMessage("");
  };

  const jumpToStep = (index) => {
    if (completedSteps.includes(index) || index === currentStep) {
      setCurrentStep(index);
    }
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
      
      setShowSuccess(true);
      
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

  const progressPercentage = ((currentStep) / TOTAL_STEPS) * 100;

  // ============================================
  // PANTALLA DE ÉXITO
  // ============================================
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-[modalSlideIn_0.3s_ease-out]">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-teal-600" size={48} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Perfil Creado!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu perfil profesional ha sido creado exitosamente. Los reclutadores ya pueden encontrarte.
            </p>
            <div className="flex items-center justify-center gap-2 text-teal-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-600 border-t-transparent" />
              <span className="font-medium">Cargando tu perfil...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // FORMULARIO PRINCIPAL
  // ============================================
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-24 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        
        {/* Header - Más compacto */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex items-center justify-between border-b border-teal-800 rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Crear Perfil Profesional</h2>
            <p className="text-teal-100 text-xs mt-1">Paso {currentStep} de {TOTAL_STEPS}: {STEP_TITLES[currentStep]}</p>
          </div>
          <button
            onClick={closeModal}
            disabled={isSubmitting}
            className="bg-white/20 hover:bg-white/30 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 group"
            aria-label="Cerrar"
          >
            <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Progress Bar - Más compacto */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          {/* Indicadores de pasos con scroll horizontal */}
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-2 min-w-max">
              {Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1).map((step) => (
                <React.Fragment key={step}>
                  <button
                    onClick={() => jumpToStep(step)}
                    disabled={!completedSteps.includes(step) && step !== currentStep}
                    title={STEP_TITLES[step]}
                    className={`flex-shrink-0 w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all duration-300 ${
                      step === currentStep
                        ? 'bg-teal-600 text-white shadow-lg scale-110'
                        : completedSteps.includes(step)
                        ? 'bg-teal-100 text-teal-600 border-2 border-teal-600 cursor-pointer hover:bg-teal-200'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {completedSteps.includes(step) ? (
                      <Check size={12} />
                    ) : (
                      step
                    )}
                  </button>
                  {step < TOTAL_STEPS && (
                    <div className={`w-4 h-0.5 ${
                      completedSteps.includes(step) ? 'bg-teal-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-300 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className="bg-teal-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content - Con scroll optimizado */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions - Más compacto */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex-shrink-0">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex-1 px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="flex-1 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-5 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Crear Perfil
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCreatePerfilFreelancer;