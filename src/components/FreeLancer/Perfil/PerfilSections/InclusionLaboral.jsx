import { Edit } from "lucide-react";

function InclusionLaboral({ perfilData }) {
  const inclusion = perfilData.inclusionLaboral || {};

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Inclusión Laboral</h2>
        <button className="px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-semibold flex items-center gap-2">
          <Edit size={18} />
          Editar
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">¿Tienes alguna discapacidad?</p>
          <p className="font-bold text-gray-900">{inclusion.discapacidad || 'No especificado'}</p>
        </div>
        {inclusion.discapacidad === 'Si' && (
          <div>
            <p className="text-sm text-gray-600">¿Requiere algún ajuste para la entrevista?</p>
            <p className="font-semibold text-gray-900">{inclusion.ajuste_entrevista || 'No'}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default InclusionLaboral;