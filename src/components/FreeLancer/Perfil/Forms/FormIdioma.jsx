import React from 'react';

function FormIdioma({ formData, onChange, mode }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Idioma *
        </label>
        <input
          type="text"
          name="idioma"
          value={formData.idioma || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Ej: Inglés, Francés, etc."
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
          <option value="Nativo">Nativo</option>
        </select>
      </div>
    </div>
  );
}

export default FormIdioma;