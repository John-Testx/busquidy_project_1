import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CheckCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import StepEmpresa from "./Steps/StepEmpresa";
import StepRepresentante from "./Steps/StepRepresentante";
import { useEmpresaProfile } from "@/hooks";

function ModalCreatePerfilEmpresa({ closeModal, id_usuario, onProfileCreated }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const { isSubmitting, showSuccess, createProfile } = useEmpresaProfile({
    id_usuario,
    onSuccess: async () => {
      if (onProfileCreated && typeof onProfileCreated === 'function') {
        await onProfileCreated();
      }
      closeModal();
    }
  });

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
    { title: "Información Empresarial", component: StepEmpresa },
    { title: "Representante Legal", component: StepRepresentante },
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
    await createProfile(data);
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // PANTALLA DE ÉXITO
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="text-white" size={56} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Perfil Creado Exitosamente!
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Tu perfil empresarial está listo. Ya puedes comenzar a publicar proyectos y encontrar talento.
            </p>
            <div className="flex items-center justify-center gap-3 text-teal-600">
              <div className="animate-spin rounded-full h-6 w-6 border-3 border-teal-600 border-t-transparent" />
              <span className="font-semibold">Cargando tu panel...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FORMULARIO PRINCIPAL - Con mejor posicionamiento
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
      {/* Wrapper con margen top para evitar navbar */}
      <div className="w-full flex items-center justify-center min-h-full py-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-auto">
          
          {/* Header compacto */}
          <div className="bg-gradient-to-r from-[#07767c] to-[#40E0D0] px-6 py-5 flex items-center justify-between rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Crear Perfil Empresarial</h2>
              <p className="text-white/80 text-sm">Paso {currentStep + 1} de {steps.length}</p>
            </div>
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="bg-white/20 hover:bg-white/30 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar compacto */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <button
                    onClick={() => jumpToStep(index)}
                    disabled={!completedSteps.includes(index) && index !== currentStep}
                    className={`flex-shrink-0 w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-[#07767c] text-white shadow-md scale-110'
                        : completedSteps.includes(index)
                        ? 'bg-green-100 text-green-600 border-2 border-green-600 cursor-pointer hover:bg-green-200'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {completedSteps.includes(index) ? (
                      <CheckCircle size={16} />
                    ) : (
                      index + 1
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 rounded ${
                      completedSteps.includes(index) ? 'bg-[#07767c]' : 'bg-gray-300'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#07767c] to-[#40E0D0] h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content con altura máxima controlada */}
          <div className="px-6 py-6 max-h-[calc(85vh-200px)] overflow-y-auto">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <StepComponent />

                {/* Form Actions */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={onPrevStep}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                      Anterior
                    </button>
                  )}
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={onNextStep}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#40E0D0] hover:from-[#055a5f] hover:to-[#07767c] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                      Siguiente
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
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
    </div>
  );
}

export default ModalCreatePerfilEmpresa;