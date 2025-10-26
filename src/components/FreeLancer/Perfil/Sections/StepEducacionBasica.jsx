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

function StepEducacionBasica({ freelancerData, handleChange, handleSelectChange }) {
  const tipoOptions = [
    { value: "Educación básica", label: "Educación básica" },
    { value: "Educación media", label: "Educación media" },
    { value: "Educación básica y media", label: "Educación básica y media" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-teal-200">
        Educación Básica/Media
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institución <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="institucion_basica_media"
            placeholder="Nombre del colegio/liceo"
            value={freelancerData.educacion_basica_media.institucion_basica_media}
            onChange={(e) => handleChange(e, "educacion_basica_media")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo <span className="text-red-500">*</span>
          </label>
          <Select
            options={tipoOptions}
            placeholder="Selecciona el tipo"
            onChange={(option) => handleSelectChange(option, "educacion_basica_media", "tipo")}
            className="react-select-container"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={{
              ...customSelectStyles,
              menuPortal: (base) => ({ ...base, zIndex: 9999 })
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            País <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pais"
            placeholder="País"
            value={freelancerData.educacion_basica_media.pais}
            onChange={(e) => handleChange(e, "educacion_basica_media")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ciudad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ciudad_basica_media"
            placeholder="Ciudad"
            value={freelancerData.educacion_basica_media.ciudad_basica_media}
            onChange={(e) => handleChange(e, "educacion_basica_media")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año de Inicio <span className="text-red-500">*</span>
          </label>
          <Select
            options={yearOptions}
            placeholder="Selecciona el año"
            onChange={(option) => handleSelectChange(option, "educacion_basica_media", "ano_inicio_basica_media")}
            className="react-select-container"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={{
              ...customSelectStyles,
              menuPortal: (base) => ({ ...base, zIndex: 9999 })
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año de Término <span className="text-red-500">*</span>
          </label>
          <Select
            options={yearOptions}
            placeholder="Selecciona el año"
            onChange={(option) => handleSelectChange(option, "educacion_basica_media", "ano_termino_basica_media")}
            className="react-select-container"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={{
              ...customSelectStyles,
              menuPortal: (base) => ({ ...base, zIndex: 9999 })
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StepEducacionBasica;