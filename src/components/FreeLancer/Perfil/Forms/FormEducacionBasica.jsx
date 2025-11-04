import React from 'react';

function FormEducacionBasica({ formData, onChange, mode }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Institución *
        </label>
        <input
          type="text"
          name="institucion"
          value={formData.institucion || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Nombre de la institución"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tipo *
        </label>
        <select
          name="tipo"
          value={formData.tipo || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="">Selecciona una opción</option>
          <option value="Educacion basica">Educación básica</option>
          <option value="Educacion media">Educación media</option>
          <option value="Educacion basica y media">Educación básica y media</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          País *
        </label>
        <select
          name="pais"
          value={formData.pais || 'Chile'}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="Chile">Chile</option>
          <option value="Argentina">Argentina</option>
          <option value="Colombia">Colombia</option>
          <option value="Venezuela">Venezuela</option>
          <option value="Peru">Perú</option>
          <option value="Ecuador">Ecuador</option>
          <option value="Cuba">Cuba</option>
          <option value="El Salvador">El Salvador</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ciudad *
        </label>
        <input
          type="text"
          name="ciudad"
          value={formData.ciudad || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Ciudad"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Año de Término
          </label>
          <select
            name="ano_termino"
            value={formData.ano_termino || ''}
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
    </div>
  );
}

export default FormEducacionBasica;