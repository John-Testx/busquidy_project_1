import { Edit } from "lucide-react";

function ExperienciaLaboral({ perfilData }) {
  const trabajo = perfilData.trabajoPractica || [];

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Experiencia Laboral</h2>
        <button className="px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-semibold flex items-center gap-2">
          <Edit size={18} />
          Editar
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-gray-900 mb-2">Años de experiencia</h3>
        <p className="text-3xl font-bold text-gray-900">
          {trabajo.length > 0 ? `${trabajo.length} año${trabajo.length > 1 ? 's' : ''}` : '0 años'}
        </p>
      </div>

      {trabajo.length > 0 ? (
        <div className="space-y-4">
          {trabajo.map((exp, idx) => (
            <div key={idx} className="border-t border-gray-200 pt-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{exp.cargo}</h4>
                  <p className="text-sm text-gray-600">{exp.empresa}</p>
                  <p className="text-sm text-gray-500">{exp.mes_inicio} {exp.ano_inicio}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
              {exp.descripcion && (
                <p className="text-sm text-gray-700 mt-2">{exp.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No hay experiencia laboral registrada</p>
      )}
    </section>
  );
}

export default ExperienciaLaboral;