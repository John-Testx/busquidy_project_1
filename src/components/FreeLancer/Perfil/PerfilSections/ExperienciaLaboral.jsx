import { Edit, Plus, Trash2, Briefcase } from "lucide-react";

function ExperienciaLaboral({ perfilData, openAddModal, openEditModal, handleDelete }) {
  const trabajo = perfilData.trabajoPractica || [];

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Experiencia Laboral</h2>
        <button 
          onClick={() => openAddModal('experiencia')}
          className="px-4 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#05595d] transition-colors font-semibold flex items-center gap-2"
        >
          <Plus size={18} />
          Agregar
        </button>
      </div>

      <div className="mb-4 bg-gradient-to-br from-[#07767c]/10 to-[#40E0D0]/10 rounded-lg p-4 border border-[#07767c]/20">
        <h3 className="font-bold text-gray-900 mb-2">Años de experiencia</h3>
        <p className="text-3xl font-bold text-[#07767c]">
          {trabajo.length > 0 ? `${trabajo.length} año${trabajo.length > 1 ? 's' : ''}` : '0 años'}
        </p>
      </div>

      {trabajo.length > 0 ? (
        <div className="space-y-4">
          {trabajo.map((exp, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-[#07767c] transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <Briefcase className="text-[#07767c] flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{exp.cargo}</h4>
                    <p className="text-sm text-gray-600">{exp.empresa}</p>
                    <p className="text-sm text-gray-500">{exp.mes_inicio} {exp.ano_inicio}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal('experiencia', exp)}
                    className="p-2 hover:bg-[#07767c]/10 rounded-lg transition-colors"
                  >
                    <Edit size={18} className="text-[#07767c]" />
                  </button>
                  <button 
                    onClick={() => handleDelete(exp.id_trabajo_practica, 'experiencia')}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
              {exp.descripcion && (
                <p className="text-sm text-gray-700 mt-2 ml-8">{exp.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No hay experiencia laboral registrada</p>
      )}
    </section>
  );
}

export default ExperienciaLaboral;