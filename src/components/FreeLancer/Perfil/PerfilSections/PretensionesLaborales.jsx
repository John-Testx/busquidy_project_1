import { Edit, Calendar, Target } from "lucide-react";

function PretensionesLaborales({ perfilData, openEditModal }) {
  const pretensiones = perfilData.pretensiones || {};

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Pretensiones Laborales</h2>
        <button 
          onClick={() => openEditModal('pretensiones', pretensiones)}
          className="px-4 py-2 border-2 border-[#07767c] text-[#07767c] rounded-lg hover:bg-[#07767c] hover:text-white transition-colors font-semibold flex items-center gap-2"
        >
          <Edit size={18} />
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#07767c]/10 to-[#40E0D0]/10 rounded-lg p-4 border border-[#07767c]/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-[#07767c]" size={20} />
            <p className="text-sm text-gray-600 font-medium">Disponibilidad</p>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {pretensiones.disponibilidad || 'No especificada'}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-[#07767c]/10 to-[#40E0D0]/10 rounded-lg p-4 border border-[#07767c]/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-[#07767c]" size={20} />
            <p className="text-sm text-gray-600 font-medium">Renta esperada</p>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {pretensiones.renta_esperada 
              ? `$${pretensiones.renta_esperada.toLocaleString("es-CL")}` 
              : 'A convenir'}
          </p>
        </div>
      </div>

      {(pretensiones.preferencias || pretensiones.tipo_proyecto) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pretensiones.preferencias && (
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Preferencias Adicionales</p>
                <p className="text-gray-900">{pretensiones.preferencias}</p>
              </div>
            )}
            {pretensiones.tipo_proyecto && (
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Tipo de Proyecto</p>
                <p className="text-gray-900">{pretensiones.tipo_proyecto}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default PretensionesLaborales;