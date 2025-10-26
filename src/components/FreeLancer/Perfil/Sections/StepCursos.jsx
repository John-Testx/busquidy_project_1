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

function StepCursos({ freelancerData, handleChange, handleSelectChange, setFreelancerData }) {
  const [nuevoCurso, setNuevoCurso] = useState({
    nombre_curso: "",
    institucion_curso: "",
    ano_inicio_curso: "",
    mes_inicio_curso: "",
  });

  const meses = [
    { value: "Enero", label: "Enero" },
    { value: "Febrero", label: "Febrero" },
    { value: "Marzo", label: "Marzo" },
    { value: "Abril", label: "Abril" },
    { value: "Mayo", label: "Mayo" },
    { value: "Junio", label: "Junio" },
    { value: "Julio", label: "Julio" },
    { value: "Agosto", label: "Agosto" },
    { value: "Septiembre", label: "Septiembre" },
    { value: "Octubre", label: "Octubre" },
    { value: "Noviembre", label: "Noviembre" },
    { value: "Diciembre", label: "Diciembre" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));

  const addCurso = () => {
    if (nuevoCurso.nombre_curso.trim() && nuevoCurso.institucion_curso.trim() && nuevoCurso.ano_inicio_curso && nuevoCurso.mes_inicio_curso) {
      setFreelancerData((prevData) => ({
        ...prevData,
        cursos: [...(prevData.cursos || []), nuevoCurso],
      }));
      setNuevoCurso({ nombre_curso: "", institucion_curso: "", ano_inicio_curso: "", mes_inicio_curso: "" });
    }
  };

  const deleteCurso = (index) => {
    setFreelancerData((prevData) => ({
      ...prevData,
      cursos: prevData.cursos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-teal-200">
        Cursos y Certificaciones
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Curso</label>
          <input
            type="text"
            placeholder="Ej: Certificación en React.js"
            value={nuevoCurso.nombre_curso}
            onChange={(e) => setNuevoCurso({ ...nuevoCurso, nombre_curso: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institución</label>
          <input
            type="text"
            placeholder="Ej: Coursera, Udemy, Universidad"
            value={nuevoCurso.institucion_curso}
            onChange={(e) => setNuevoCurso({ ...nuevoCurso, institucion_curso: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Año de Inicio</label>
          <Select
            options={years}
            placeholder="Selecciona año"
            onChange={(option) => setNuevoCurso({ ...nuevoCurso, ano_inicio_curso: option.value })}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customSelectStyles}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mes de Inicio</label>
          <Select
            options={meses}
            placeholder="Selecciona mes"
            onChange={(option) => setNuevoCurso({ ...nuevoCurso, mes_inicio_curso: option.value })}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customSelectStyles}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={addCurso}
        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        Agregar Curso
      </button>

      {freelancerData.cursos && freelancerData.cursos.length > 0 && (
        <div className="border-t border-teal-200 pt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Cursos Agregados</h4>
          <div className="space-y-3">
            {freelancerData.cursos.map((curso, index) => (
              <div key={index} className="flex items-center justify-between bg-teal-50 p-4 rounded-lg border border-teal-200">
                <div>
                  <p className="font-medium text-gray-800">{curso.nombre_curso}</p>
                  <p className="text-sm text-gray-600">{curso.institucion_curso} • {curso.mes_inicio_curso} {curso.ano_inicio_curso}</p>
                </div>
                <button type="button" onClick={() => deleteCurso(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

export default StepCursos;