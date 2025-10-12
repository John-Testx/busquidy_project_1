import React from "react";
import Select from "react-select";

function StepEmprendimiento({ freelancerData, handleChange, handleSelectChange }) {
  const siNoOptions = [
    { value: "Si", label: "Sí" },
    { value: "No", label: "No" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b">Emprendimiento</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Es emprendedor? <span className="text-red-500">*</span>
        </label>
        <Select
          options={siNoOptions}
          placeholder="Selecciona una opción"
          onChange={(option) => handleSelectChange(option, "emprendimiento", "emprendedor")}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {freelancerData.emprendimiento.emprendedor === "No" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Te interesa emprender?
          </label>
          <Select
            options={siNoOptions}
            placeholder="Selecciona una opción"
            onChange={(option) => handleSelectChange(option, "emprendimiento", "interesado")}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      )}

      {freelancerData.emprendimiento.emprendedor === "Si" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año de Inicio
              </label>
              <input
                type="text"
                name="ano_inicio_emprendimiento"
                placeholder="2020"
                value={freelancerData.emprendimiento.ano_inicio_emprendimiento}
                onChange={(e) => handleChange(e, "emprendimiento")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mes de Inicio
              </label>
              <input
                type="text"
                name="mes_inicio_emprendimiento"
                placeholder="Enero"
                value={freelancerData.emprendimiento.mes_inicio_emprendimiento}
                onChange={(e) => handleChange(e, "emprendimiento")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector del Emprendimiento
            </label>
            <input
              type="text"
              name="sector_emprendimiento"
              placeholder="Tecnología, Comercio, Servicios..."
              value={freelancerData.emprendimiento.sector_emprendimiento}
              onChange={(e) => handleChange(e, "emprendimiento")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default StepEmprendimiento;