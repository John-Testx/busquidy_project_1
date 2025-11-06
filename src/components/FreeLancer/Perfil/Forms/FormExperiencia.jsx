import React from 'react';

function FormExperiencia({ formData, onChange, mode }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Empresa *
        </label>
        <input
          type="text"
          name="empresa"
          value={formData.empresa || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Nombre de la empresa"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cargo *
        </label>
        <input
          type="text"
          name="cargo"
          value={formData.cargo || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Tu cargo"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Área de Trabajo
        </label>
        <input
          type="text"
          name="area_trabajo"
          value={formData.area_trabajo || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Ej: Desarrollo Web, Marketing, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tipo de Cargo
        </label>
        <select
          name="tipo_cargo"
          value={formData.tipo_cargo || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="">Selecciona una opción</option>
          <option value="Tiempo Completo">Tiempo Completo</option>
          <option value="Medio Tiempo">Medio Tiempo</option>
          <option value="Freelance">Freelance</option>
          <option value="Contrato">Contrato</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mes de Inicio
          </label>
          <select
            name="mes_inicio"
            value={formData.mes_inicio || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="">Selecciona</option>
            {meses.map(mes => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Año de Inicio
          </label>
          <select
            name="ano_inicio"
            value={formData.ano_inicio || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="">Selecciona</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Describe tus responsabilidades y logros..."
        />
      </div>
    </div>
  );
}

export default FormExperiencia;