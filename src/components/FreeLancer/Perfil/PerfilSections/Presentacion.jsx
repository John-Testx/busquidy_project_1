import { Edit } from "lucide-react";

function Presentacion({ perfilData }) {
  const freelancer = perfilData.freelancer || {};

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Presentación</h2>
        <button className="px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-semibold flex items-center gap-2">
          <Edit size={18} />
          Editar presentación
        </button>
      </div>
      <p className="text-gray-700 leading-relaxed">
        {freelancer.descripcion || 'No hay descripción disponible'}
      </p>
    </section>
  );
}

export default Presentacion;