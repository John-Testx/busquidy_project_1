import { Edit, Calendar, Target } from "lucide-react";

function PretensionesLaborales({ perfilData }) {
  const pretensiones = perfilData.pretensiones || {};

  return (
    <section className="bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Pretensiones Laborales</h2>
        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold flex items-center gap-2">
          <Edit size={18} />
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-white/80" size={20} />
            <p className="text-sm text-white/80">Disponibilidad</p>
          </div>
          <p className="text-lg font-bold">{pretensiones.disponibilidad || 'No especificada'}</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-white/80" size={20} />
            <p className="text-sm text-white/80">Renta esperada</p>
          </div>
          <p className="text-lg font-bold">
            ${pretensiones.renta_esperada?.toLocaleString("es-CL") || 'A convenir'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default PretensionesLaborales;