import React from "react";
import Select from "react-select";

function StepDatosPersonales({ freelancerData, handleChange, handleSelectChange }) {
  const regionesOptions = [
    { value: "Region Metropolitana", label: "Región Metropolitana" },
    { value: "V Region", label: "V Región" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-teal-200">
        Información Personal
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombres <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombres"
            placeholder="Ej: Juan Pablo"
            value={freelancerData.antecedentes_personales.nombres}
            onChange={(e) => handleChange(e, "antecedentes_personales")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellidos <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="apellidos"
            placeholder="Ej: González Silva"
            value={freelancerData.antecedentes_personales.apellidos}
            onChange={(e) => handleChange(e, "antecedentes_personales")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Identificación (RUT/DNI) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="identificacion"
            placeholder="12.345.678-9"
            value={freelancerData.antecedentes_personales.identificacion}
            onChange={(e) => handleChange(e, "antecedentes_personales")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Nacimiento <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={freelancerData.antecedentes_personales.fecha_nacimiento}
            onChange={(e) => handleChange(e, "antecedentes_personales")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="direccion"
          placeholder="Av. Principal 1234, Depto 56"
          value={freelancerData.antecedentes_personales.direccion}
          onChange={(e) => handleChange(e, "antecedentes_personales")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Región <span className="text-red-500">*</span>
          </label>
          <Select
            options={regionesOptions}
            placeholder="Selecciona tu región"
            onChange={(option) => handleSelectChange(option, "antecedentes_personales", "region")}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
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
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ciudad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ciudad_freelancer"
            placeholder="Santiago"
            value={freelancerData.antecedentes_personales.ciudad_freelancer}
            onChange={(e) => handleChange(e, "antecedentes_personales")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comuna <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="comuna"
            placeholder="Lo Prado"
            value={freelancerData.antecedentes_personales.comuna}
            onChange={(e) => handleChange(e, "antecedentes_personales")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nacionalidad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nacionalidad"
            placeholder="Chileno/a"
            value={freelancerData.antecedentes_personales.nacionalidad}
            onChange={(e) => handleChange(e, "antecedentes_personales")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado Civil <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="estado_civil"
          placeholder="Soltero/a, Casado/a, etc."
          value={freelancerData.antecedentes_personales.estado_civil}
          onChange={(e) => handleChange(e, "antecedentes_personales")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  );
}

export default StepDatosPersonales;