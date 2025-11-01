import { Plus, Languages, XCircle } from "lucide-react";

function Conocimientos({ perfilData }) {
  const idiomas = perfilData.idiomas || [];
  const habilidades = perfilData.habilidades || [];

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Conocimientos</h2>

      {/* Idiomas */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Idiomas</h3>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus size={18} />
            Agregar
          </button>
        </div>

        {idiomas.length > 0 ? (
          <div className="space-y-2">
            {idiomas.map((idioma, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Languages className="text-blue-600" size={20} />
                  <span className="font-semibold text-gray-900">{idioma.idioma}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {idioma.nivel}
                  </span>
                  <button className="text-gray-600 hover:text-gray-900">
                    <XCircle size={18} />
                  </button>
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
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus size={18} />
            Agregar
          </button>
        </div>

        {habilidades.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {habilidades.map((hab, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{hab.habilidad}</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white border border-green-300 text-green-700 rounded text-xs font-medium">
                        {hab.categoria}
                      </span>
                      <span className="text-gray-600 text-xs">•</span>
                      <span className="text-gray-700 text-xs font-medium">{hab.nivel}</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700">
                    <XCircle size={18} />
                  </button>
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