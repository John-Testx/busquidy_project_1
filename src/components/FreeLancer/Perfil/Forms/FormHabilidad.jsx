import React from 'react';
import { optionsCategorySkills } from '@/common/consts';

function FormHabilidad({ formData, onChange, mode }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Categoría *
        </label>
        <select
          name="categoria"
          value={formData.categoria || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="">Selecciona una categoría</option>
          {optionsCategorySkills.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Habilidad *
        </label>
        <input
          type="text"
          name="habilidad"
          value={formData.habilidad || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Ej: React, Photoshop, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nivel *
        </label>
        <select
          name="nivel"
          value={formData.nivel || 'Básico'}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>
    </div>
  );
}

export default FormHabilidad;