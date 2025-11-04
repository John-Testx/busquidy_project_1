import { Edit, Plus, GraduationCap, Trash2 } from "lucide-react";

function FormacionAcademica({ perfilData, openAddModal, openEditModal, handleDelete }) {
  const educacion_sup = perfilData.educacionSuperior || [];
  const educacion_basica = perfilData.educacionBasicaMedia || [];
  const nivelEducacional = perfilData.nivelEducacional || {};

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Formación Académica</h2>

      {/* Nivel Educacional */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Nivel educacional</h3>
          <button 
            onClick={() => openEditModal('formacion', nivelEducacional)}
            className="px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-semibold flex items-center gap-2"
          >
            <Edit size={18} />
            Editar
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-red-600 font-bold">{nivelEducacional.nivel_academico || 'No especificado'}</p>
          <p className="text-sm text-gray-600">{nivelEducacional.estado || ''}</p>
        </div>
      </div>

      {/* Educación Superior */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Educación superior</h3>
          <button 
            onClick={() => openAddModal('educacion_superior')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>
        
        {educacion_sup.length > 0 ? (
          <div className="space-y-4">
            {educacion_sup.map((edu, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-blue-600" size={20} />
                    <div>
                      <h4 className="font-bold text-gray-900">{edu.carrera}</h4>
                      {edu.estado && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                          {edu.estado}
                        </span>
                      )}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded" defaultChecked />
                    Mostrar en CV
                  </label>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-1">
                  {edu.ano_inicio} {edu.estado === 'Cursando' ? '(Estudiante)' : `(${edu.estado})`}
                </p>
                <p className="text-sm text-gray-600">
                  {edu.institucion} - {edu.ciudad || 'Santiago'}, {edu.pais || 'Chile'}
                </p>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => openEditModal('educacion_superior', edu)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Edit size={14} />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(edu.id_educacion_superior, 'educacion_superior')}
                    className="px-3 py-1 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Sin información</p>
        )}
      </div>

      {/* Educación Básica y Media */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Educación básica y media</h3>
          <button 
            onClick={() => openAddModal('educacion_basica')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>

        {educacion_basica.length > 0 ? (
          <div className="space-y-4">
            {educacion_basica.map((edu, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{edu.tipo}</h4>
                    <p className="text-sm text-gray-700">{edu.ano_inicio} - {edu.ano_termino}</p>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded" defaultChecked />
                    Mostrar en CV
                  </label>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {edu.institucion} - {edu.ciudad}, {edu.pais}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal('educacion_basica', edu)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Edit size={14} />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(edu.id_educacion_basica_media, 'educacion_basica')}
                    className="px-3 py-1 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Sin información</p>
        )}
      </div>
    </section>
  );
}

export default FormacionAcademica;