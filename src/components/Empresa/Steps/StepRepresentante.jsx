import React from "react";
import { useFormContext } from "react-hook-form";

export default function StepRepresentante() {
  const { register, formState: { errors } } = useFormContext();

  const fields = [
    { label: "Nombre Completo", name: "representante.nombre_completo" },
    { label: "Cargo", name: "representante.cargo" },
    { label: "Correo del Representante", name: "representante.correo_representante", type: "email" },
    { label: "Teléfono del Representante", name: "representante.telefono_representante" },
  ];

  return (
    <div className="perfil-empresa-form-step">
      <h2>Información del Representante</h2>
      {fields.map(f => (
        <div key={f.name} className="perfil-empresa-form-group">
          <label htmlFor={f.name}>{f.label}</label>
          <input
            id={f.name}
            type={f.type || "text"}
            {...register(f.name, { required: "Este campo es obligatorio" })}
          />
          {errors[f.name] && <p className="error-message">{errors[f.name].message}</p>}
        </div>
      ))}
    </div>
  );
}