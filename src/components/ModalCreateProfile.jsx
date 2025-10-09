import React, { useState } from "react";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import "../styles/ModalCreatePerfil.css";

function ModalCreatePerfil({ 
  closeModal, 
  id_usuario, 
  steps, 
  defaultValues, 
  submitUrl, 
  transformData 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const methods = useForm({ defaultValues });
  const { handleSubmit, trigger, getValues } = methods;

  const StepComponent = steps[currentStep].component;

  const onNextStep = async () => {
    const allValues = getValues();
    const stepKeys = Object.keys(allValues);
    const valid = await trigger(stepKeys);
    if (valid) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
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
      const finalData = transformData ? transformData(data) : data;

      await axios.post(
        submitUrl,
        { ...finalData, id_usuario },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error al crear el perfil:", error);
    }
  };

  return (
    <div className="perfil-modal-overlay">
      <div className="perfil-modal-content">
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

            <div className="perfil-form-actions">
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

export default ModalCreatePerfil;
