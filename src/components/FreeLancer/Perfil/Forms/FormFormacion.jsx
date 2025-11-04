import React from 'react';

function FormFormacion({ formData, onChange, mode }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nivel Educacional *
        </label>
        <select
          name="nivel_academico"
          value={formData.nivel_academico || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="">Selecciona una opción</option>
          <option value="Basica">Básica</option>
          <option value="Media">Media</option>
          <option value="Universidad">Universidad</option>
          <option value="Postgrado">Postgrado</option>
          <option value="Doctorado">Doctorado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Estado *
        </label>
        <select
          name="estado"
          value={formData.estado || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="">Selecciona una opción</option>
          <option value="Completa">Completa</option>
          <option value="Incompleta">Incompleta</option>
        </select>
      </div>
    </div>
  );
}

export default FormFormacion;