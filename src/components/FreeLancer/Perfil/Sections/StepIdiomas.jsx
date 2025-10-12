import React, { useState } from "react";
import Select from "react-select";
import { Plus, Trash2 } from "lucide-react";

function StepIdiomas({ freelancerData, handleChange, handleSelectChange, setFreelancerData }) {
  const [nuevoIdioma, setNuevoIdioma] = useState({ idioma: "", nivel_idioma: "" });

  const nivelOptions = [
    { value: "Básico", label: "Básico" },
    { value: "Intermedio", label: "Intermedio" },
    { value: "Avanzado", label: "Avanzado" },
    { value: "Nativo", label: "Nativo" },
  ];

  const addIdioma = () => {
    if (nuevoIdioma.idioma.trim() && nuevoIdioma.nivel_idioma) {
      setFreelancerData((prevData) => ({
        ...prevData,
        idiomas: [...prevData.idiomas, nuevoIdioma],
      }));
      setNuevoIdioma({ idioma: "", nivel_idioma: "" });
    }
  };

  const deleteIdioma = (index) => {
    setFreelancerData((prevData) => ({
      ...prevData,
      idiomas: prevData.idiomas.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b">Idiomas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
          <input
            type="text"
            placeholder="Ej: Inglés, Francés, Alemán"
            value={nuevoIdioma.idioma}
            onChange={(e) => setNuevoIdioma({ ...nuevoIdioma, idioma: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
          <Select
            options={nivelOptions}
            placeholder="Selecciona nivel"
            onChange={(option) =>
              setNuevoIdioma({ ...nuevoIdioma, nivel_idioma: option.value })
            }
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={addIdioma}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        Agregar Idioma
      </button>

      {freelancerData.idiomas.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Idiomas Agregados</h4>
          <div className="space-y-3">
            {freelancerData.idiomas.map((idioma, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-800">{idioma.idioma}</p>
                  <p className="text-sm text-gray-600">Nivel: {idioma.nivel_idioma}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteIdioma(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

export default StepIdiomas;