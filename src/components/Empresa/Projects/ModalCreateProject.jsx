import React, { useState } from "react";
import Select from "react-select";
import "../../../styles/Empresa/ModalCreateProject.css";
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
    // Validate all fields in current step
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
    <div className="create-project-overlay">
      <div className="create-project-content">
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
            <StepComponent control={control} />

            <div className="create-project-footer">
              {currentStep > 0 && (
                <button type="button" onClick={onPrevStep}>
                  Anterior
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={onNextStep}>
                  Siguiente
                </button>
              ) : (
                <button type="submit">Crear Proyecto</button>
              )}
              <button type="button" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default ModalCreateProject;
