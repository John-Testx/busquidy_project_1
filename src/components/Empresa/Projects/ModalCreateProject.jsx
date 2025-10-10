import React, { useState } from "react";
import Select from "react-select";
// import "../../../styles/Empresa/ModalCreateProject.css";
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
    { title: "Información del Proyecto", component: StepProjectInfo },
    { title: "Detalles Adicionales", component: StepProjectDetails },
    { title: "Información Adicional", component: StepProjectAdditional },
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#07767c] to-[#0a9199] px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Crear Nuevo Proyecto</h2>
          <button 
            onClick={closeModal} 
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-8 bg-gray-50 border-b">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => jumpToStep(index)}
                className={`flex flex-col items-center flex-1 relative ${
                  completedSteps.includes(index) ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 transition-colors duration-300 ${
                      completedSteps.includes(index) ? 'bg-[#07767c]' : 'bg-gray-300'
                    }`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-[#07767c] text-white ring-4 ring-[#07767c]/30 scale-110'
                      : completedSteps.includes(index)
                      ? 'bg-[#07767c] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {completedSteps.includes(index) ? '✓' : index + 1}
                </div>

                {/* Step Title */}
                <span
                  className={`text-xs text-center font-medium transition-colors duration-300 ${
                    index === currentStep
                      ? 'text-[#07767c] font-semibold'
                      : completedSteps.includes(index)
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-8 py-6">
              <StepComponent control={control} />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-8 py-5 flex justify-between items-center gap-4 border-t rounded-b-2xl">
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
                    className="px-6 py-2.5 text-[#07767c] bg-white hover:bg-[#07767c]/5 border border-[#07767c] rounded-lg transition-colors font-medium"
                  >
                    ← Anterior
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={onNextStep}
                    className="px-6 py-2.5 bg-[#07767c] hover:bg-[#055a5f] text-white rounded-lg transition-colors font-medium"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                  >
                    ✓ Crear Proyecto
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default ModalCreateProject;