import React from 'react';

function FormPresentacion({ formData, onChange, mode }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion || ''}
          onChange={handleChange}
          required
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Cuéntanos sobre ti, tu experiencia, tus objetivos profesionales..."
        />
        <p className="text-sm text-gray-500 mt-2">
          Esta es tu oportunidad de destacar. Describe tus habilidades, experiencia y qué te hace único.
        </p>
      </div>
    </div>
  );
}

export default FormPresentacion;