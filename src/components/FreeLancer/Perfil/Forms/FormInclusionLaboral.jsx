import React from 'react';

function FormInclusionLaboral({ formData, onChange, mode }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ¿Tienes alguna discapacidad? *
        </label>
        <select
          name="discapacidad"
          value={formData.discapacidad || 'No'}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="Si">Sí</option>
          <option value="No">No</option>
        </select>
      </div>

      {formData.discapacidad === 'Si' && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Registro Nacional de Discapacidad
            </label>
            <select
              name="registro_nacional"
              value={formData.registro_nacional || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
              <option value="EnTramite">En trámite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pensión de Invalidez
            </label>
            <select
              name="pension_invalidez"
              value={formData.pension_invalidez || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Selecciona una opción</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
              <option value="EnTramite">En trámite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Discapacidad
            </label>
            <input
              type="text"
              name="tipo_discapacidad"
              value={formData.tipo_discapacidad || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Describe tu tipo de discapacidad"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ajustes para la Entrevista
            </label>
            <textarea
              name="ajuste_entrevista"
              value={formData.ajuste_entrevista || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Describe los ajustes que necesitas para la entrevista (ej: acceso para silla de ruedas, intérprete de lengua de señas, etc.)"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default FormInclusionLaboral;