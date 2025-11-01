import { Edit } from "lucide-react";

function Emprendimiento({ perfilData }) {
  const emprendimiento = perfilData.emprendimiento || {};

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Emprendimiento</h2>
        <button className="px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-semibold flex items-center gap-2">
          <Edit size={18} />
          Editar
        </button>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-600">¿Estás emprendiendo?</p>
          <p className="font-bold text-red-600">{emprendimiento.emprendedor || 'No'}</p>
        </div>
        {emprendimiento.emprendedor === 'Si' && (
          <div>
            <p className="text-sm text-gray-600">¿Te gustaría?</p>
            <p className="font-semibold text-gray-900">{emprendimiento.interesado || 'No'}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Emprendimiento;