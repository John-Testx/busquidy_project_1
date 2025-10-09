import React from "react";
import { useFormContext } from "react-hook-form";

export default function Step1Descripcion() {
  const { register } = useFormContext();

  return (
    <div className="perfil-freelancer-form-step">
      <h3>Descripción y Contacto</h3>

      <div className="perfil-freelancer-form-group">
        <label htmlFor="descripcion_freelancer">Descripción</label>
        <textarea
          id="descripcion_freelancer"
          placeholder="Escribe una breve descripción de ti..."
          {...register("freelancer.descripcion_freelancer", { required: true })}
        />
      </div>

      <div className="perfil-freelancer-form-group">
        <label htmlFor="correo_contacto">Correo Contacto</label>
        <input
          type="email"
          id="correo_contacto"
          {...register("freelancer.correo_contacto", { required: true })}
        />
      </div>

      <div className="perfil-freelancer-form-group">
        <label htmlFor="telefono_contacto">Teléfono Contacto</label>
        <input
          type="text"
          id="telefono_contacto"
          {...register("freelancer.telefono_contacto", { required: true })}
        />
      </div>

      <div className="perfil-freelancer-form-group">
        <label htmlFor="linkedin_link">LinkedIn (Opcional)</label>
        <input type="text" id="linkedin_link" {...register("freelancer.linkedin_link")} />
      </div>
    </div>
  );
}
