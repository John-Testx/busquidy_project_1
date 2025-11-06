import { Edit } from "lucide-react";

function InformacionGeneral({ perfilData, openEditModal }) {
  const personal = perfilData.antecedentesPersonales || {};
  const freelancer = perfilData.freelancer || {};

  const datosCompletos = {
    ...personal,
    correo_contacto: freelancer.correo_contacto,
    telefono_contacto: freelancer.telefono_contacto
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Información General</h2>
        <button 
          onClick={() => openEditModal('informacion_general', datosCompletos)}
          className="px-4 py-2 border-2 border-[#07767c] text-[#07767c] rounded-lg hover:bg-[#07767c] hover:text-white transition-colors font-semibold flex items-center gap-2"
        >
          <Edit size={18} />
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="Nombre completo" value={`${personal.nombres || ''} ${personal.apellidos || ''}`} />
        <InfoField label="Correo electrónico" value={freelancer.correo_contacto || 'No especificado'} />
        <InfoField label="Fecha de nacimiento" value={personal.fecha_nacimiento || 'No especificada'} />
        <InfoField label="RUT N°" value={personal.identificacion || 'No especificado'} />
        <InfoField label="Género" value={personal.genero || 'No especificado'} />
        <InfoField label="Nacionalidad" value={personal.nacionalidad || 'No especificada'} />
        <InfoField label="Ubicación" value={`${personal.ciudad || ''}, ${personal.region || ''}`} />
        <InfoField label="Comuna" value={personal.comuna || 'No especificada'} />
        <InfoField label="Dirección" value={personal.direccion || 'No especificada'} />
        <InfoField label="Estado civil" value={personal.estado_civil || 'No especificado'} />
        <InfoField label="Celular" value={freelancer.telefono_contacto || 'No especificado'} />
        <div>
          <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
          {freelancer.linkedin_link ? (
            <a href={freelancer.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-[#07767c] hover:underline font-semibold">
              Ver perfil
            </a>
          ) : (
            <p className="text-gray-400 font-semibold">No especificado</p>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{value || 'No especificado'}</p>
    </div>
  );
}

export default InformacionGeneral;