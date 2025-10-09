import React, { useState } from "react";
import "../../../styles/Empresa/ModalCreatePerfilEmpresa.css";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import StepEmpresa from "../Steps/StepEmpresa";
import StepRepresentante from "../Steps/StepRepresentante";

function ModalCreatePerfilEmpresa({ closeModal, id_usuario }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

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
    }
  };

  return (
    <div className="perfil-empresa-overlay">
      <div className="perfil-empresa-content">
        <button onClick={closeModal} className="close-button">X</button>

        {/* Progress bar */}
        <div className="progress-bar-container">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${index === currentStep ? "active" : ""} ${completedSteps.includes(index) ? "completed" : ""}`}
              onClick={() => jumpToStep(index)}
              style={{ cursor: completedSteps.includes(index) ? "pointer" : "default" }}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <StepComponent />

            <div className="perfil-empresa-form-actions">
              {currentStep > 0 && <button type="button" onClick={onPrevStep}>Anterior</button>}
              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={onNextStep}>Siguiente</button>
              ) : (
                <button type="submit">Guardar</button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default ModalCreatePerfilEmpresa;
