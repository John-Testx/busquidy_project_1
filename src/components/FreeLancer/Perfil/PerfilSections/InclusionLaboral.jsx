import { Edit, Plus } from "lucide-react";

function InclusionLaboral({ perfilData, openAddModal, openEditModal }) {
  const inclusion = perfilData.inclusionLaboral || {};
  const tieneInclusion = inclusion && Object.keys(inclusion).length > 0;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Inclusión Laboral</h2>
        {tieneInclusion ? (
          <button 
            onClick={() => openEditModal('inclusion_laboral', inclusion)}
            className="px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-semibold flex items-center gap-2"
          >
            <Edit size={18} />
            Editar
          </button>
        ) : (
          <button 
            onClick={() => openAddModal('inclusion_laboral')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar
          </button>
        )}
      </div>

      {tieneInclusion ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">¿Tienes alguna discapacidad?</p>
            <p className="font-bold text-gray-900">{inclusion.discapacidad || 'No especificado'}</p>
          </div>
          
          {inclusion.discapacidad === 'Si' && (
            <>
              {inclusion.tipo_discapacidad && (
                <div>
                  <p className="text-sm text-gray-600">Tipo de discapacidad</p>
                  <p className="font-semibold text-gray-900">{inclusion.tipo_discapacidad}</p>
                </div>
              )}
              
              {inclusion.registro_nacional && (
                <div>
                  <p className="text-sm text-gray-600">Registro Nacional de Discapacidad</p>
                  <p className="font-semibold text-gray-900">{inclusion.registro_nacional}</p>
                </div>
              )}
              
              {inclusion.pension_invalidez && (
                <div>
                  <p className="text-sm text-gray-600">Pensión de Invalidez</p>
                  <p className="font-semibold text-gray-900">{inclusion.pension_invalidez}</p>
                </div>
              )}
              
              {inclusion.ajuste_entrevista && (
                <div>
                  <p className="text-sm text-gray-600">Ajustes para la entrevista</p>
                  <p className="font-semibold text-gray-900">{inclusion.ajuste_entrevista}</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Sin información de inclusión laboral</p>
      )}
    </section>
  );
}

export default InclusionLaboral;