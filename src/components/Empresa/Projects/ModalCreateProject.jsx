import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import StepProjectInfo from "./ProjectForm/StepProjectInfo";
import StepProjectDetails from "./ProjectForm/StepProjectDetails";
import StepProjectAdditional from "./ProjectForm/StepProjectAdditional";

function ModalCreateProject({ closeModal, id_usuario, addProject }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

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
    },
  });

  const { handleSubmit, trigger, control, getValues } = methods;

  const steps = [
    { 
      title: "Información del Proyecto", 
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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/projects/create-project",
        { projectData: data, id_usuario },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const newProject = {
          ...response.data,
          ...data,
          estado_publicacion: "sin publicar",
          fecha_creacion: new Date().toISOString(),
        };
        addProject(newProject);
        toast.success("Proyecto creado exitosamente");
        closeModal();
      }
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      toast.error(error.message || "Error al crear el proyecto");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-[modalSlideIn_0.3s_ease-out]">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#07767c] to-[#0a9199] px-6 py-5 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Crear Nuevo Proyecto</h2>
          </div>
          <button 
            onClick={closeModal} 
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 hover:rotate-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-8 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
          <div className="flex justify-between items-start max-w-3xl mx-auto relative">
            {/* Background progress line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full" style={{ width: 'calc(100% - 48px)', left: '24px' }} />
            <div 
              className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#07767c] to-[#0a9199] rounded-full transition-all duration-500"
              style={{ 
                width: `calc((100% - 48px) * ${completedSteps.length > 0 ? completedSteps.length / (steps.length - 1) : 0})`,
                left: '24px'
              }}
            />

            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              const isCurrent = index === currentStep;
              const isClickable = isCompleted || isCurrent;

              return (
                <div
                  key={index}
                  onClick={() => isClickable && jumpToStep(index)}
                  className={`flex flex-col items-center flex-1 relative z-10 ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {/* Step Circle */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm mb-3 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-br from-[#07767c] to-[#0a9199] text-white ring-4 ring-[#07767c]/20 scale-110 shadow-lg'
                        : isCompleted
                        ? 'bg-gradient-to-br from-[#07767c] to-[#0a9199] text-white shadow-md'
                        : 'bg-white text-gray-400 border-2 border-gray-200 shadow-sm'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Step Title */}
                  <span
                    className={`text-sm text-center font-medium transition-colors duration-300 max-w-[120px] ${
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

        {/* Form Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-8 py-6">
                <StepComponent control={control} />
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 to-white px-8 py-5 flex justify-between items-center gap-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>

                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={onPrevStep}
                      className="px-6 py-2.5 text-[#07767c] bg-white hover:bg-[#07767c]/5 border-2 border-[#07767c] rounded-lg transition-all font-medium flex items-center gap-2"
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
                      className="px-6 py-2.5 bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white rounded-lg transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      Siguiente
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-xl flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Crear Proyecto
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