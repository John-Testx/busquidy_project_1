// StepEmpresa.js
import React from "react";
import { useFormContext } from "react-hook-form";

export default function StepEmpresa() {
  const { register, formState: { errors } } = useFormContext();

  const fields = [
    { label: "Nombre de la Empresa", name: "empresa.nombre_empresa" },
    { label: "Identificación Fiscal", name: "empresa.identificacion_fiscal" },
    { label: "Dirección", name: "empresa.direccion" },
    { label: "Teléfono de contacto", name: "empresa.telefono_contacto" },
    { label: "Correo de la empresa", name: "empresa.correo_empresa" },
    { label: "Página web", name: "empresa.pagina_web" },
    { label: "Sector industrial", name: "empresa.sector_industrial" },
    { label: "Descripción de la empresa", name: "empresa.descripcion" },
  ];

  return (
    <div className="perfil-empresa-form-step">
      <h2>Información de la Empresa</h2>
      {fields.map(f => (
        <div key={f.name} className="perfil-empresa-form-group">
          <label htmlFor={f.name}>{f.label}</label>
          <input
            id={f.name}
            {...register(f.name, { required: "Este campo es obligatorio" })}
          />
          {errors[f.name] && <p className="error-message">{errors[f.name].message}</p>}
        </div>
      ))}
    </div>
  );
}
