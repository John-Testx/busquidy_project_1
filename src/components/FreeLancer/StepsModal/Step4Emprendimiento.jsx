import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import Select from "react-select";

export default function Step4Emprendimiento() {
  const { control, watch, register } = useFormContext();
  const emprendedor = watch("emprendimiento.emprendedor");

  return (
    <div className="perfil-freelancer-form-step">
      <h3>Emprendimiento</h3>

      <div className="grupos-container">
        <div className="perfil-freelancer-form-group">
          <label htmlFor="emprendedor">¿Es emprendedor?</label>
          <div style={{ width: "700px", marginLeft: "32px" }}>
            <Controller
              name="emprendimiento.emprendedor"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { value: "Si", label: "Sí" },
                    { value: "No", label: "No" },
                  ]}
                  onChange={(option) => field.onChange(option.value)}
                  className="select"
                />
              )}
            />
          </div>
        </div>
      </div>

      {emprendedor === "No" && (
        <div className="grupos-container">
          <div className="perfil-freelancer-form-group">
            <label htmlFor="interesado">¿Te interesa emprender?</label>
            <div style={{ width: "700px", marginLeft: "32px" }}>
              <Controller
                name="emprendimiento.interesado"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Si", label: "Sí" },
                      { value: "No", label: "No" },
                    ]}
                    onChange={(option) => field.onChange(option.value)}
                    className="select"
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}

      {emprendedor === "Si" && (
        <>
          <div className="grupos-container">
            <div className="perfil-freelancer-form-group">
              <label htmlFor="ano_inicio_emprendimiento">Año de Inicio</label>
              <input
                type="text"
                {...register("emprendimiento.ano_inicio_emprendimiento")}
                id="ano_inicio_emprendimiento"
                required
              />
            </div>
            <div className="perfil-freelancer-form-group">
              <label htmlFor="mes_inicio_emprendimiento">Mes de Inicio</label>
              <input
                type="text"
                {...register("emprendimiento.mes_inicio_emprendimiento")}
                id="mes_inicio_emprendimiento"
              />
            </div>
          </div>

          <div className="grupos-container">
            <div className="perfil-freelancer-form-group">
              <label htmlFor="sector_emprendimiento">
                Sector del Emprendimiento
              </label>
              <div style={{ width: "700px", marginLeft: "32px" }}>
                <Controller
                  name="emprendimiento.sector_emprendimiento"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: "Comercio", label: "Comercio" },
                        { value: "Tecnología", label: "Tecnología" },
                        { value: "Servicios", label: "Servicios" },
                      ]}
                      onChange={(option) => field.onChange(option.value)}
                      className="select"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
