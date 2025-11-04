import React from 'react';

function FormPretensiones({ formData, onChange, mode }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Disponibilidad *
        </label>
        <select
          name="disponibilidad"
          value={formData.disponibilidad || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="">Selecciona una opción</option>
          <option value="Inmediata">Inmediata</option>
          <option value="1 semana">1 semana</option>
          <option value="2 semanas">2 semanas</option>
          <option value="1 mes">1 mes</option>
          <option value="A convenir">A convenir</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Renta Esperada *
        </label>
        <input
          type="number"
          name="renta_esperada"
          value={formData.renta_esperada || ''}
          onChange={handleChange}
          required
          min="0"
          step="1000"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Ej: 800000"
        />
        <p className="text-sm text-gray-500 mt-2">
          Ingresa tu expectativa salarial mensual en pesos chilenos
        </p>
      </div>
    </div>
  );
}

export default FormPretensiones;