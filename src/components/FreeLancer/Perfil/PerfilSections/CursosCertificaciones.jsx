import { Plus, Award, Trash2, Edit } from "lucide-react";

function CursosCertificaciones({ perfilData, openAddModal, openEditModal, handleDelete }) {
  const cursos = perfilData.cursos || [];

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Cursos y Certificaciones</h2>
        <button 
          onClick={() => openAddModal('curso')}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
        >
          <Plus size={18} />
          Agregar
        </button>
      </div>

      {cursos.length > 0 ? (
        <div className="space-y-3">
          {cursos.map((curso, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Award className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{curso.nombre_curso}</h4>
                    <p className="text-sm text-gray-600">{curso.institucion}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {curso.mes_inicio} {curso.ano_inicio}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal('curso', curso)}
                    className="text-gray-600 hover:text-gray-900 p-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(curso.id_curso, 'curso')}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Sin cursos registrados</p>
      )}
    </section>
  );
}

export default CursosCertificaciones;