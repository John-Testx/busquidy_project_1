import React, { useState } from "react";
import Select from "react-select";
import { Plus, Trash2 } from "lucide-react";

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

function StepHabilidades({ freelancerData, handleSelectChange, setFreelancerData }) {
  const [nuevaHabilidad, setNuevaHabilidad] = useState({
    categoria: "",
    habilidad: "",
    nivel_habilidad: "",
  });

  const categoryOptions = [
    { value: "Programación", label: "Programación" },
    { value: "Diseño", label: "Diseño" },
    { value: "Marketing", label: "Marketing" },
    { value: "Escritura", label: "Escritura" },
    { value: "Administración", label: "Administración" },
    { value: "Atención al cliente", label: "Atención al cliente" },
    { value: "Otra", label: "Otra" },
  ];

  const nivelOptions = [
    { value: "Básico", label: "Básico" },
    { value: "Intermedio", label: "Intermedio" },
    { value: "Avanzado", label: "Avanzado" },
  ];

  const addHabilidad = () => {
    if (nuevaHabilidad.categoria && nuevaHabilidad.habilidad.trim() && nuevaHabilidad.nivel_habilidad) {
      setFreelancerData((prevData) => ({
        ...prevData,
        habilidades: [...prevData.habilidades, nuevaHabilidad],
      }));
      setNuevaHabilidad({ categoria: "", habilidad: "", nivel_habilidad: "" });
    }
  };

  const deleteHabilidad = (index) => {
    setFreelancerData((prevData) => ({
      ...prevData,
      habilidades: prevData.habilidades.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-teal-200">
        Habilidades
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <Select
            options={categoryOptions}
            placeholder="Selecciona categoría"
            onChange={(option) => setNuevaHabilidad({ ...nuevaHabilidad, categoria: option.value })}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customSelectStyles}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Habilidad</label>
          <input
            type="text"
            placeholder="Ej: React, Figma, SEO"
            value={nuevaHabilidad.habilidad}
            onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, habilidad: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
          <Select
            options={nivelOptions}
            placeholder="Selecciona nivel"
            onChange={(option) => setNuevaHabilidad({ ...nuevaHabilidad, nivel_habilidad: option.value })}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customSelectStyles}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={addHabilidad}
        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        Agregar Habilidad
      </button>

      {freelancerData.habilidades.length > 0 && (
        <div className="border-t border-teal-200 pt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Habilidades Agregadas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freelancerData.habilidades.map((habilidad, index) => (
              <div key={index} className="flex items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{habilidad.habilidad}</p>
                  <p className="text-sm text-gray-600">{habilidad.categoria} • {habilidad.nivel_habilidad}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteHabilidad(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StepHabilidades;