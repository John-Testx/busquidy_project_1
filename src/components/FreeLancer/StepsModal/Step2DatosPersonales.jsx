import React from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-select";

const StepDatosPersonales = () => {
  const { register, setValue } = useFormContext();

  const handleSelectChange = (option) => {
    setValue("antecedentes_personales.region", option?.value || "");
  };

  return (
    <div className="perfil-freelancer-form-step">
      <h3>Datos Personales</h3>

      <div className="grupos-container">
        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.nombres">Nombres</label>
          <input
            type="text"
            id="antecedentes_personales.nombres"
            {...register("antecedentes_personales.nombres", { required: true })}
          />
        </div>

        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.apellidos">Apellidos</label>
          <input
            type="text"
            id="antecedentes_personales.apellidos"
            {...register("antecedentes_personales.apellidos", { required: true })}
          />
        </div>
      </div>

      <div className="grupos-container">
        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.identificacion">Identificación</label>
          <input
            type="text"
            id="antecedentes_personales.identificacion"
            placeholder="RUT, DNI, etc."
            {...register("antecedentes_personales.identificacion", { required: true })}
          />
        </div>

        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.fecha_nacimiento">Fecha de Nacimiento</label>
          <input
            type="date"
            id="antecedentes_personales.fecha_nacimiento"
            {...register("antecedentes_personales.fecha_nacimiento", { required: true })}
          />
        </div>
      </div>

      <div className="grupos-container">
        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.direccion">Dirección</label>
          <input
            type="text"
            id="antecedentes_personales.direccion"
            placeholder="Av Dep Calle 2323..."
            {...register("antecedentes_personales.direccion", { required: true })}
          />
        </div>

        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.region">Región</label>
          <div style={{ width: "320px", marginLeft: "32px" }}>
            <Select
              placeholder="Selecciona una opción"
              options={[
                { value: "Region Metropolitana", label: "Región Metropolitana" },
                { value: "V Region", label: "V Región" },
              ]}
              className="select"
              onChange={handleSelectChange}
            />
          </div>
        </div>
      </div>

      <div className="grupos-container">
        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.ciudad_freelancer">Ciudad</label>
          <input
            type="text"
            id="antecedentes_personales.ciudad_freelancer"
            {...register("antecedentes_personales.ciudad_freelancer", { required: true })}
          />
        </div>

        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.comuna">Comuna</label>
          <input
            type="text"
            id="antecedentes_personales.comuna"
            {...register("antecedentes_personales.comuna", { required: true })}
          />
        </div>
      </div>

      <div className="grupos-container">
        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.nacionalidad">Nacionalidad</label>
          <input
            type="text"
            id="antecedentes_personales.nacionalidad"
            {...register("antecedentes_personales.nacionalidad", { required: true })}
          />
        </div>

        <div className="perfil-freelancer-form-group">
          <label htmlFor="antecedentes_personales.estado_civil">Estado Civil</label>
          <input
            type="text"
            id="antecedentes_personales.estado_civil"
            {...register("antecedentes_personales.estado_civil", { required: true })}
          />
        </div>
      </div>
    </div>
  );
};

export default StepDatosPersonales;
