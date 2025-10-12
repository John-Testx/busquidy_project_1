import React from "react";
import Select from "react-select"; 

function StepPretensiones({ freelancerData, handleChange, handleSelectChange }) {
  const disponibilidadOptions = [
    { value: "Tiempo completo", label: "Tiempo completo" },
    { value: "Medio tiempo", label: "Medio tiempo" },
    { value: "Por proyecto", label: "Por proyecto" },
    { value: "Flexible", label: "Flexible" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b">Pretensiones Laborales</h3>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">Esta información ayuda a las empresas a encontrar profesionales que se ajusten a sus necesidades.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad <span className="text-red-500">*</span></label>
        <Select
          options={disponibilidadOptions}
          placeholder="Selecciona tu disponibilidad"
          onChange={(option) => handleSelectChange(option, "pretensiones", "disponibilidad")}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Renta Esperada (mensual en CLP) <span className="text-red-500">*</span></label>
        <input
          type="number"
          name="renta_esperada"
          placeholder="Ej: 1500000"
          value={freelancerData.pretensiones.renta_esperada}
          onChange={(e) => handleChange(e, "pretensiones")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          min="0"
        />
        <p className="mt-2 text-sm text-gray-500">Ingresa el salario esperado mensualmente. Este dato es confidencial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferencias Adicionales</label>
          <textarea
            name="preferencias"
            rows={4}
            placeholder="Ej: Prefiero trabajar remoto, disponible para viajar..."
            value={freelancerData.pretensiones.preferencias || ""}
            onChange={(e) => handleChange(e, "pretensiones")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Proyecto</label>
          <textarea
            name="tipo_proyecto"
            rows={4}
            placeholder="Ej: Startups, freelance, emprendimiento..."
            value={freelancerData.pretensiones.tipo_proyecto || ""}
            onChange={(e) => handleChange(e, "pretensiones")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-gray-800 mb-3">Resumen de Pretensiones</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">Disponibilidad:</span> {freelancerData.pretensiones.disponibilidad || "No especificada"}</p>
          <p><span className="font-medium">Renta esperada:</span> {freelancerData.pretensiones.renta_esperada ? `$${freelancerData.pretensiones.renta_esperada.toLocaleString("es-CL")}` : "No especificada"}</p>
        </div>
      </div>
    </div>
  );
}

export default StepPretensiones;