import { Plus, Languages, Trash2, Edit, Lightbulb } from "lucide-react";

function Conocimientos({ perfilData, openAddModal, openEditModal, handleDelete }) {
  const idiomas = perfilData.idiomas || [];
  const habilidades = perfilData.habilidades || [];

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Conocimientos</h2>

      {/* Idiomas */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Idiomas</h3>
          <button 
            onClick={() => openAddModal('idioma')}
            className="px-4 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#05595d] transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>

        {idiomas.length > 0 ? (
          <div className="space-y-2">
            {idiomas.map((idioma, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#07767c] transition-colors">
                <div className="flex items-center gap-3">
                  <Languages className="text-[#07767c]" size={20} />
                  <span className="font-semibold text-gray-900">{idioma.idioma}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#07767c]/10 text-[#07767c] rounded-lg text-sm font-medium">
                    {idioma.nivel}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEditModal('idioma', idioma)}
                      className="p-1 hover:bg-[#07767c]/10 rounded transition-colors"
                    >
                      <Edit size={16} className="text-[#07767c]" />
                    </button>
                    <button 
                      onClick={() => handleDelete(idioma.id_idioma, 'idioma')}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Sin idiomas registrados</p>
        )}
      </div>

      {/* Habilidades */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Habilidades</h3>
          <button 
            onClick={() => openAddModal('habilidad')}
            className="px-4 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#05595d] transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>

        {habilidades.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {habilidades.map((hab, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-[#07767c] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    <Lightbulb className="text-[#07767c] flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{hab.habilidad}</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#07767c]/10 text-[#07767c] rounded text-xs font-medium">
                          {hab.categoria}
                        </span>
                        <span className="text-gray-600 text-xs">•</span>
                        <span className="text-gray-700 text-xs font-medium">{hab.nivel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEditModal('habilidad', hab)}
                      className="p-1 hover:bg-[#07767c]/10 rounded transition-colors"
                    >
                      <Edit size={16} className="text-[#07767c]" />
                    </button>
                    <button 
                      onClick={() => handleDelete(hab.id_habilidad, 'habilidad')}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Sin habilidades registradas</p>
        )}
      </div>
    </section>
  );
}

export default Conocimientos;