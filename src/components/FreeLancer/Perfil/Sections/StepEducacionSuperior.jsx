import React from "react";
import Select from "react-select"; 

function StepEducacionSuperior({ freelancerData, handleChange, handleSelectChange }) {
  const carreraAfinOptions = [
    { value: "Informatica", label: "Informática" },
    { value: "Ingenieria", label: "Ingeniería" },
    { value: "Administracion", label: "Administración" },
    { value: "Otra", label: "Otra" },
  ];

  const estadoOptions = [
    { value: "Cursando", label: "Cursando" },
    { value: "Egresado", label: "Egresado" },
    { value: "Titulado", label: "Titulado" },
    { value: "Incompleta", label: "Incompleta" },
  ];

  // Generar años dinámicamente
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b">Educación Superior</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institución <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="institucion_superior"
            placeholder="Universidad, Instituto..."
            value={freelancerData.educacion_superior.institucion_superior}
            onChange={(e) => handleChange(e, "educacion_superior")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carrera <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="carrera"
            placeholder="Nombre de la carrera"
            value={freelancerData.educacion_superior.carrera}
            onChange={(e) => handleChange(e, "educacion_superior")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Área Afín <span className="text-red-500">*</span>
          </label>
          <Select
            options={carreraAfinOptions}
            placeholder="Selecciona el área"
            onChange={(option) => handleSelectChange(option, "educacion_superior", "carrera_afin")}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado <span className="text-red-500">*</span>
          </label>
          <Select
            options={estadoOptions}
            placeholder="Selecciona el estado"
            onChange={(option) => handleSelectChange(option, "educacion_superior", "estado_superior")}
            className="react-select-container"
            classNamePrefix="react-select"
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
            onChange={(option) => handleSelectChange(option, "educacion_superior", "ano_inicio_superior")}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año de Término <span className="text-red-500">*</span>
          </label>
          <Select
            options={yearOptions}
            placeholder="Selecciona el año"
            onChange={(option) => handleSelectChange(option, "educacion_superior", "ano_termino_superior")}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>
    </div>
  );
}

export default StepEducacionSuperior;