import React from "react";
import { Controller } from "react-hook-form";

export default function StepProjectDetails({ control }) {
  return (
    <div className="create-project-form-step">
      <h3>Detalles Adicionales</h3>

      <div className="create-project-form-group">
        <label>Habilidades Requeridas</label>
        <Controller
          name="habilidades_requeridas"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field }) => (
            <input {...field} placeholder="Ej: React, Node.js, etc." />
          )}
        />
      </div>

      <div className="create-project-form-group">
        <label>Presupuesto Estimado (CLP)</label>
        <Controller
          name="presupuesto"
          control={control}
          rules={{ required: "El presupuesto es obligatorio" }}
          render={({ field }) => (
            <input type="number" {...field} placeholder="Monto en CLP" />
          )}
        />
      </div>

      <div className="create-project-form-group">
        <label>Duración Estimada</label>
        <Controller
          name="duracion_estimada"
          control={control}
          rules={{ required: "La duración es obligatoria" }}
          render={({ field }) => (
            <input {...field} placeholder="Ej: 2 semanas, 1 mes" />
          )}
        />
      </div>

      <div className="create-project-form-group">
        <label>Fecha Límite de Entrega</label>
        <Controller
          name="fecha_limite"
          control={control}
          rules={{ required: "La fecha límite es obligatoria" }}
          render={({ field }) => <input type="date" {...field} />}
        />
      </div>
    </div>
  );
}
