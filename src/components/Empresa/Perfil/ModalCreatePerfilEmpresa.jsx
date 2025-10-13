import React, { useState } from "react";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import StepEmpresa from "./Steps/StepEmpresa";
import StepRepresentante from "./Steps/StepRepresentante";

function ModalCreatePerfilEmpresa({ closeModal, id_usuario }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    defaultValues: {
      empresa: {
        nombre_empresa: "",
        identificacion_fiscal: "",
        direccion: "",
        telefono_contacto: "",
        correo_empresa: "",
        pagina_web: "",
        descripcion: "",
        sector_industrial: "",
      },
      representante: {
        nombre_completo: "",
        cargo: "",
        correo_representante: "",
        telefono_representante: "",
      },
    },
  });

  const { handleSubmit, trigger } = methods;

  const steps = [
    { title: "Empresa", component: StepEmpresa },
    { title: "Representante", component: StepRepresentante },
  ];

  const StepComponent = steps[currentStep].component;

  const onNextStep = async () => {
    const stepFields = Object.keys(methods.getValues()).flatMap(section =>
      Object.keys(methods.getValues()[section])
    );
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
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/api/empresa/create-perfil-empresa",
        { empresaData: data.empresa, representanteData: data.representante, id_usuario },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error al crear el perfil de la empresa:", error);
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 flex items-center justify-between border-b border-teal-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Crear Perfil de Empresa</h2>
            <p className="text-teal-100 text-sm mt-1">Paso {currentStep + 1} de {steps.length}</p>
          </div>
          <button
            onClick={closeModal}
            className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
            aria-label="Cerrar"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 flex-1">
                {/* Step Circle */}
                <button
                  onClick={() => jumpToStep(index)}
                  disabled={!completedSteps.includes(index) && index !== currentStep}
                  className={`flex-shrink-0 w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-teal-600 text-white shadow-lg scale-110'
                      : completedSteps.includes(index)
                      ? 'bg-teal-100 text-teal-600 border-2 border-teal-600 cursor-pointer hover:bg-teal-200'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {completedSteps.includes(index) ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    index + 1
                  )}
                </button>

                {/* Step Title */}
                <span className={`hidden sm:inline font-semibold text-sm ${
                  index === currentStep ? 'text-teal-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-1 rounded ${
                    completedSteps.includes(index) ? 'bg-teal-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <StepComponent />

              {/* Form Actions */}
              <div className="flex gap-4 mt-12 pt-8 border-t border-gray-200">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={onPrevStep}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-chevron-left"></i>
                    Anterior
                  </button>
                )}
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={onNextStep}
                    className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Siguiente
                    <i className="fas fa-chevron-right"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner animate-spin"></i>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle"></i>
                        Guardar Perfil
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default ModalCreatePerfilEmpresa;