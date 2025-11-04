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
            className="px-4 py-2 border-2 border-[#07767c] text-[#07767c] rounded-lg hover:bg-[#07767c] hover:text-white transition-colors font-semibold flex items-center gap-2"
          >
            <Edit size={18} />
            Editar
          </button>
        </div>
        <div className="bg-gradient-to-br from-[#07767c]/10 to-[#40E0D0]/10 rounded-lg p-4 border border-[#07767c]/20">
          <p className="text-[#07767c] font-bold text-lg">{nivelEducacional.nivel_academico || 'No especificado'}</p>
          <p className="text-sm text-gray-600">{nivelEducacional.estado || ''}</p>
        </div>
      </div>

      {/* Educación Superior */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Educación superior</h3>
          <button 
            onClick={() => openAddModal('educacion_superior')}
            className="px-4 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#05595d] transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>
        
        {educacion_sup.length > 0 ? (
          <div className="space-y-4">
            {educacion_sup.map((edu, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-[#07767c] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <GraduationCap className="text-[#07767c]" size={20} />
                    <div>
                      <h4 className="font-bold text-gray-900">{edu.carrera}</h4>
                      {edu.estado && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                          {edu.estado}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal('educacion_superior', edu)}
                      className="p-2 hover:bg-[#07767c]/10 rounded-lg transition-colors"
                    >
                      <Edit size={16} className="text-[#07767c]" />
                    </button>
                    <button 
                      onClick={() => handleDelete(edu.id_educacion_superior, 'educacion_superior')}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-1">
                  {edu.ano_inicio} - {edu.ano_termino}
                </p>
                <p className="text-sm text-gray-600">
                  {edu.institucion}
                </p>
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
            className="px-4 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#05595d] transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>

        {educacion_basica.length > 0 ? (
          <div className="space-y-4">
            {educacion_basica.map((edu, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-[#07767c] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{edu.tipo}</h4>
                    <p className="text-sm text-gray-700">{edu.ano_inicio} - {edu.ano_termino}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal('educacion_basica', edu)}
                      className="p-2 hover:bg-[#07767c]/10 rounded-lg transition-colors"
                    >
                      <Edit size={16} className="text-[#07767c]" />
                    </button>
                    <button 
                      onClick={() => handleDelete(edu.id_educacion_basica_media, 'educacion_basica')}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {edu.institucion} - {edu.ciudad}, {edu.pais}
                </p>
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