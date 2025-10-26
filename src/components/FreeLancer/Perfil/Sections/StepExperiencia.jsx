import React from "react";
import Select from "react-select";

const customSelectStyles = {
  control: (base) => ({
    ...base,
    borderColor: '#d1d5db',
    '&:hover': { borderColor: '#14b8a6' },
    boxShadow: 'none',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#14b8a6' : state.isFocused ? '#ccfbf1' : 'white',
    color: state.isSelected ? 'white' : '#374151',
  }),
};

function StepExperiencia({ freelancerData, handleChange, handleSelectChange }) {
  const siNoOptions = [
    { value: "Si", label: "Sí" },
    { value: "No", label: "No" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-teal-200">
        Experiencia Laboral
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Tiene experiencia laboral? <span className="text-red-500">*</span>
        </label>
        <Select
          options={siNoOptions}
          placeholder="Selecciona una opción"
          onChange={(option) => handleSelectChange(option, "trabajo_practica", "experiencia_laboral")}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customSelectStyles}
        />
      </div>

      {freelancerData.trabajo_practica.experiencia_laboral === "Si" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <input
                type="text"
                name="empresa"
                placeholder="Nombre de la empresa"
                value={freelancerData.trabajo_practica.empresa || ""}
                onChange={(e) => handleChange(e, "trabajo_practica")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo
              </label>
              <input
                type="text"
                name="cargo"
                placeholder="Tu cargo o posición"
                value={freelancerData.trabajo_practica.cargo || ""}
                onChange={(e) => handleChange(e, "trabajo_practica")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área de Trabajo
              </label>
              <input
                type="text"
                name="area_trabajo"
                placeholder="Desarrollo, Marketing, etc."
                value={freelancerData.trabajo_practica.area_trabajo || ""}
                onChange={(e) => handleChange(e, "trabajo_practica")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cargo
              </label>
              <input
                type="text"
                name="tipo_cargo"
                placeholder="Full-time, Part-time, etc."
                value={freelancerData.trabajo_practica.tipo_cargo || ""}
                onChange={(e) => handleChange(e, "trabajo_practica")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
<label className="block text-sm font-medium text-gray-700 mb-2">
                Año de Inicio
              </label>
              <input
                type="text"
                name="ano_inicio_trabajo"
                placeholder="2020"
                value={freelancerData.trabajo_practica.ano_inicio_trabajo || ""}
                onChange={(e) => handleChange(e, "trabajo_practica")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mes de Inicio
              </label>
              <input
                type="text"
                name="mes_inicio_trabajo"
                placeholder="Enero"
                value={freelancerData.trabajo_practica.mes_inicio_trabajo || ""}
                onChange={(e) => handleChange(e, "trabajo_practica")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de Funciones
            </label>
            <textarea
              name="descripcion"
              rows={4}
              placeholder="Describe tus responsabilidades y logros en este puesto..."
              value={freelancerData.trabajo_practica.descripcion || ""}
              onChange={(e) => handleChange(e, "trabajo_practica")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default StepExperiencia;