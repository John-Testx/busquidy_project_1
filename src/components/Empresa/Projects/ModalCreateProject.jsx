import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { createProject } from "@/api/projectsApi";
import useAuth from "@/hooks/auth/useAuth";

import StepProjectInfo from "./ProjectForm/StepProjectInfo";
import StepProjectDetails from "./ProjectForm/StepProjectDetails";
import StepProjectAdditional from "./ProjectForm/StepProjectAdditional";

function ModalCreateProject({ closeModal, id_usuario, addProject, terminologia, tipoParaBackend }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Obtén el usuario para asegurar que tenemos la terminología correcta
  const { user } = useAuth();
  const esNatural = user?.tipo_usuario === "empresa_natural";

  // ✅ Define terminología interna por si no se pasa como prop
  const terminologiaInterna = terminologia || {
    singular: esNatural ? "Tarea" : "Proyecto",
    plural: esNatural ? "Tareas" : "Proyectos",
  };
  
  const tipoParaBackendInterno = tipoParaBackend || (esNatural ? "tarea" : "proyecto");

  const methods = useForm({
    defaultValues: {
      titulo: "",
      descripcion: "",
      categoria: "",
      habilidades_requeridas: "",
      presupuesto: "",
      duracion_estimada: "",
      fecha_limite: "",
      ubicacion: "",
      tipo_contratacion: "",
      metodologia_trabajo: "",
      tipo: tipoParaBackendInterno, // ✅ AGREGAR: Campo tipo inicializado
    },
  });

  const { handleSubmit, trigger, control, getValues, setValue } = methods;

  // ✅ AGREGAR: useEffect para actualizar el tipo cuando cambie
  useEffect(() => {
    setValue("tipo", tipoParaBackendInterno);
  }, [tipoParaBackendInterno, setValue]);

  const steps = [
    { 
      title: `Información de${terminologiaInterna.singular === 'Tarea' ? ' la' : 'l'} ${terminologiaInterna.singular}`, 
      component: StepProjectInfo,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: "Detalles Adicionales", 
      component: StepProjectDetails,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    { 
      title: "Información Adicional", 
      component: StepProjectAdditional,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
  ];

  const StepComponent = steps[currentStep].component;

  const onNextStep = async () => {
    const stepFields = Object.keys(getValues());
    const valid = await trigger(stepFields);
    if (valid) {
      setCompletedSteps([...new Set([...completedSteps, currentStep])]);
      setCurrentStep(currentStep + 1);
    }
  };

  const onPrevStep = () => setCurrentStep(currentStep - 1);

  const jumpToStep = (index) => {
    if (completedSteps.includes(index) || index === currentStep) {
      setCurrentStep(index);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // ✅ MODIFICADO: Asegurar que el tipo esté incluido en los datos
      const finalData = {
        ...data,
        tipo: tipoParaBackendInterno, // Forzar el tipo correcto
      };

      console.log("📤 Datos enviados al backend:", finalData); // Para debug
      
      const response = await createProject(finalData, id_usuario);

      console.log("📨 Respuesta del backend:", response);

      const newProject = {
        ...finalData, // (ej: titulo, descripcion...)
        ...response.newProject, // (Esto incluye el ID y cualquier otro dato del backend)
        
        // Asignación explícita del ID para asegurar la 'key' de React
        id_proyecto: response.newProject.id_proyecto, // O 'response.newProject.id'
        
        // Estado y fecha que definimos localmente
        estado_publicacion: "sin publicar",
        fecha_creacion: new Date().toISOString(),
      };
      
      addProject(newProject);
      toast.success(`${terminologiaInterna.singular} creada exitosamente`);
      closeModal();
    } catch (error) {
      console.error(`Error al crear ${terminologiaInterna.singular.toLowerCase()}:`, error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        `Error al crear ${terminologiaInterna.singular.toLowerCase()}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-24 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[80vh] overflow-hidden shadow-2xl animate-[modalSlideIn_0.3s_ease-out] flex flex-col">
        {/* Header - Más compacto */}
        <div className="bg-gradient-to-r from-[#07767c] to-[#0a9199] px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">
              Crear Nuev{terminologiaInterna.singular === 'Tarea' ? 'a' : 'o'} {terminologiaInterna.singular}
            </h2>
          </div>
          <button 
            onClick={closeModal} 
            disabled={isSubmitting}
            className="text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar - Más compacto y horizontal */}
        <div className="px-6 py-3 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center max-w-2xl mx-auto relative">
            {/* Background progress line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" style={{ width: 'calc(100% - 40px)', left: '20px' }} />
            <div 
              className="absolute top-5 left-0 h-1 bg-gradient-to-r from-[#07767c] to-[#0a9199] rounded-full transition-all duration-500"
              style={{ 
                width: `calc((100% - 40px) * ${completedSteps.length > 0 ? completedSteps.length / (steps.length - 1) : 0})`,
                left: '20px'
              }}
            />

            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              const isCurrent = index === currentStep;
              const isClickable = isCompleted || isCurrent;

              return (
                <div
                  key={index}
                  onClick={() => !isSubmitting && isClickable && jumpToStep(index)}
                  className={`flex flex-col items-center flex-1 relative z-10 ${
                    isClickable && !isSubmitting ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {/* Step Circle - Más pequeño */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mb-2 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-br from-[#07767c] to-[#0a9199] text-white ring-4 ring-[#07767c]/20 scale-110 shadow-lg'
                        : isCompleted
                        ? 'bg-gradient-to-br from-[#07767c] to-[#0a9199] text-white shadow-md'
                        : 'bg-white text-gray-400 border-2 border-gray-200 shadow-sm'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Step Title - Texto más pequeño */}
                  <span
                    className={`text-xs text-center font-medium transition-colors duration-300 max-w-[100px] ${
                      isCurrent
                        ? 'text-[#07767c] font-bold'
                        : isCompleted
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content - Scroll optimizado */}
        <div className="flex-1 overflow-y-auto">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
              <div className="flex-1 px-6 py-4">
                <StepComponent 
                  control={control} 
                  terminologia={terminologiaInterna}
                />
              </div>

              {/* Footer - Sticky en la parte inferior */}
              <div className="bg-gradient-to-t from-gray-50 to-white px-6 py-3 flex justify-between items-center gap-4 border-t border-gray-200 flex-shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>

                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={onPrevStep}
                      disabled={isSubmitting}
                      className="px-5 py-2 text-[#07767c] bg-white hover:bg-[#07767c]/5 border-2 border-[#07767c] rounded-lg transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Anterior
                    </button>
                  )}
                  
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={onNextStep}
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white rounded-lg transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg 
                            className="animate-spin h-5 w-5" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Creando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Crear {terminologiaInterna.singular}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default ModalCreateProject;