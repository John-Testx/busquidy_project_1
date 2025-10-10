import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const optionsTipoContratacion = [
  { value: "porProyecto", label: "Por proyecto" },
  { value: "porHora", label: "Por hora" },
  { value: "largoPlazo", label: "A largo plazo" },
];

export default function StepProjectAdditional({ control }) {
  return (
    <div className="create-project-form-step">
      <h3>Información Adicional</h3>

      <div className="create-project-form-group">
        <label>Ubicación del Proyecto</label>
        <Controller
          name="ubicacion"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="Remoto o ubicación específica" />
          )}
        />
      </div>

      <div className="create-project-form-group">
        <label>Tipo de Contratación</label>
        <Controller
          name="tipo_contratacion"
          control={control}
          rules={{ required: "Selecciona un tipo de contratación" }}
          render={({ field }) => (
            <Select
              options={optionsTipoContratacion}
              value={
                optionsTipoContratacion.find(
                  (option) => option.value === field.value
                ) || null
              }
              onChange={(option) => field.onChange(option.value)}
            />
          )}
        />
      </div>

      <div className="create-project-form-group">
        <label>Metodología de Trabajo</label>
        <Controller
          name="metodologia_trabajo"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="Ej: Agile, Scrum, etc." />
          )}
        />
      </div>
    </div>
  );
}
