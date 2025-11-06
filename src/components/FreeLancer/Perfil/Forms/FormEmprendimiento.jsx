import React from 'react';

function FormEmprendimiento({ formData, onChange, mode }) {
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
          ¿Estás emprendiendo actualmente? *
        </label>
        <select
          name="emprendedor"
          value={formData.emprendedor || 'No'}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="Si">Sí</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ¿Te gustaría emprender? *
        </label>
        <select
          name="interesado"
          value={formData.interesado || 'No'}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="Si">Sí</option>
          <option value="No">No</option>
        </select>
      </div>

      {(formData.emprendedor === 'Si' || formData.interesado === 'Si') && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sector de Emprendimiento
            </label>
            <input
              type="text"
              name="sector_emprendimiento"
              value={formData.sector_emprendimiento || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ej: Tecnología, Gastronomía, Comercio, etc."
            />
          </div>

          {formData.emprendedor === 'Si' && (
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
          )}
        </>
      )}
    </div>
  );
}

export default FormEmprendimiento;