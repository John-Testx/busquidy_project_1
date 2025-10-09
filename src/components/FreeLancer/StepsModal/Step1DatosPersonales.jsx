import React from "react";
import { useFormContext } from "react-hook-form";

const Step1DatosPersonales = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <h3>Datos Personales</h3>
      <div>
        <label>Nombre:</label>
        <input {...register("nombre", { required: "Nombre es obligatorio" })} />
        {errors.nombre && <p>{errors.nombre.message}</p>}
      </div>

      <div>
        <label>Apellido:</label>
        <input {...register("apellido", { required: "Apellido es obligatorio" })} />
        {errors.apellido && <p>{errors.apellido.message}</p>}
      </div>

      <div>
        <label>Email:</label>
        <input {...register("email", { required: "Email es obligatorio" })} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
    </div>
  );
};

export default Step1DatosPersonales;
