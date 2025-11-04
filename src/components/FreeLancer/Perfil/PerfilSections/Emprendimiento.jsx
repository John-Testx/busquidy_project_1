import { Edit, Plus } from "lucide-react";

function Emprendimiento({ perfilData, openAddModal, openEditModal }) {
  const emprendimiento = perfilData.emprendimiento || {};
  const tieneEmprendimiento = emprendimiento && Object.keys(emprendimiento).length > 0;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Emprendimiento</h2>
        {tieneEmprendimiento ? (
          <button 
            onClick={() => openEditModal('emprendimiento', emprendimiento)}
            className="px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-semibold flex items-center gap-2"
          >
            <Edit size={18} />
            Editar
          </button>
        ) : (
          <button 
            onClick={() => openAddModal('emprendimiento')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar
          </button>
        )}
      </div>

      {tieneEmprendimiento ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">¿Estás emprendiendo?</p>
            <p className="font-bold text-red-600">{emprendimiento.emprendedor || 'No'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">¿Te gustaría emprender?</p>
            <p className="font-semibold text-gray-900">{emprendimiento.interesado || 'No'}</p>
          </div>
          
          {emprendimiento.sector_emprendimiento && (
            <div>
              <p className="text-sm text-gray-600">Sector de emprendimiento</p>
              <p className="font-semibold text-gray-900">{emprendimiento.sector_emprendimiento}</p>
            </div>
          )}
          
          {emprendimiento.ano_inicio && emprendimiento.mes_inicio && (
            <div>
              <p className="text-sm text-gray-600">Fecha de inicio</p>
              <p className="font-semibold text-gray-900">
                {emprendimiento.mes_inicio} {emprendimiento.ano_inicio}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Sin información de emprendimiento</p>
      )}
    </section>
  );
}

export default Emprendimiento;