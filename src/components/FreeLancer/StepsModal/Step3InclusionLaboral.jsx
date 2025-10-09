import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import Select from "react-select";

export default function Step3InclusionLaboral() {
  const { control, watch, register } = useFormContext();
  const discapacidad = watch("inclusion_laboral.discapacidad");

  return (
    <div className="perfil-freelancer-form-step">
      <h3>Inclusión Laboral</h3>

      <div className="grupos-container">
        <div className="perfil-freelancer-form-group">
          <label htmlFor="discapacidad">¿Posee alguna discapacidad?</label>
          <div style={{ width: "700px", marginLeft: "32px" }}>
            <Controller
              name="inclusion_laboral.discapacidad"
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

      {discapacidad === "Si" && (
        <>
          <div className="grupos-container">
            <div className="perfil-freelancer-form-group">
              <label htmlFor="tipo_discapacidad">Tipo de Discapacidad</label>
              <input
                type="text"
                {...register("inclusion_laboral.tipo_discapacidad")}
                id="tipo_discapacidad"
                required
              />
            </div>

            <div className="perfil-freelancer-form-group">
              <label htmlFor="registro_nacional">
                ¿Está registrado en el Registro Nacional?
              </label>
              <div style={{ width: "350px", marginRight: "32px" }}>
                <Controller
                  name="inclusion_laboral.registro_nacional"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: "Si", label: "Sí" },
                        { value: "No", label: "No" },
                        { value: "En trámite", label: "En trámite" },
                      ]}
                      onChange={(option) => field.onChange(option.value)}
                      className="select"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grupos-container">
            <div className="perfil-freelancer-form-group">
              <label htmlFor="pension_invalidez">
                ¿Recibe pensión de invalidez?
              </label>
              <div style={{ width: "700px", marginLeft: "32px" }}>
                <Controller
                  name="inclusion_laboral.pension_invalidez"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: "Si", label: "Sí" },
                        { value: "No", label: "No" },
                        { value: "En trámite", label: "En trámite" },
                      ]}
                      onChange={(option) => field.onChange(option.value)}
                      className="select"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grupos-container">
            <div className="perfil-freelancer-form-group">
              <label htmlFor="ajuste_entrevista">
                ¿Requiere algún ajuste para la entrevista?
              </label>
              <textarea
                id="ajuste_entrevista"
                {...register("inclusion_laboral.ajuste_entrevista")}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
