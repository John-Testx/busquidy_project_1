import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const optionsCategoria = [
  { value: "Desarrollo Web", label: "Desarrollo Web" },
  { value: "Diseño Gráfico", label: "Diseño Gráfico" },
  { value: "Marketing Digital", label: "Marketing Digital" },
];

export default function StepProjectInfo({ control }) {
  return (
    <div className="create-project-form-step">
      <h3>Información del Proyecto</h3>

      <div className="create-project-form-group">
        <label>Título del Proyecto</label>
        <Controller
          name="titulo"
          control={control}
          rules={{ required: "El título es obligatorio" }}
          render={({ field }) => <input {...field} placeholder="Ej: Desarrollo web" />}
        />
      </div>

      <div className="create-project-form-group">
        <label>Descripción</label>
        <Controller
          name="descripcion"
          control={control}
          rules={{ required: "La descripción es obligatoria" }}
          render={({ field }) => <textarea {...field} placeholder="Descripción del proyecto" />}
        />
      </div>

      <div className="create-project-form-group">
        <label>Categoría</label>
        <Controller
          name="categoria"
          control={control}
          rules={{ required: "Selecciona una categoría" }}
          render={({ field }) => (
            <Select
              {...field}
              options={optionsCategoria}
              // IMPORTANT: map react-select's selected option to the field value
              value={optionsCategoria.find(option => option.value === field.value) || null}
              onChange={(option) => field.onChange(option.value)}
            />
          )}
        />
      </div>
    </div>
  );
}
