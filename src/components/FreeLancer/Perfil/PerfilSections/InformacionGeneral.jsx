import { Edit } from "lucide-react";

function InformacionGeneral({ perfilData, openEditModal }) {
  const personal = perfilData.antecedentesPersonales || {};
  const freelancer = perfilData.freelancer || {};

  // Combinar datos para el formulario de edición
  const datosCompletos = {
    ...personal,
    correo_contacto: freelancer.correo_contacto,
    telefono_contacto: freelancer.telefono_contacto
  };

  return (
    <section className="bg-gray-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Información General</h2>
          <span className="text-gray-500">📌</span>
        </div>
        <button 
          onClick={() => openEditModal('informacion_general', datosCompletos)}
          className="px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-semibold flex items-center gap-2"
        >
          <Edit size={18} />
          Editar
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Nombre completo" value={`${personal.nombres || ''} ${personal.apellidos || ''}`} />
          <InfoField label="Correo electrónico" value={freelancer.correo_contacto || 'No especificado'} />
          <InfoField label="Fecha de nacimiento" value={personal.fecha_nacimiento || 'No especificada'} />
          <InfoField label="RUT N°" value={personal.identificacion || 'No especificado'} />
          <InfoField label="Género" value={personal.genero || 'No especificado'} />
          <InfoField label="Nacionalidad" value={personal.nacionalidad || 'No especificada'} />
          <InfoField label="Ubicación" value={`${personal.ciudad || ''}, ${personal.region || ''}, ${personal.comuna || ''}`} />
          <InfoField label="Dirección" value={personal.direccion || 'No especificada'} />
          <InfoField label="Estado civil" value={personal.estado_civil || 'No especificado'} />
          <InfoField label="Teléfono fijo" value={personal.telefono_fijo || 'No definido'} />
          <InfoField label="Celular" value={freelancer.telefono_contacto || 'No especificado'} />
          <div>
            <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
            {freelancer.linkedin_link ? (
              <a href={freelancer.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                Ver perfil
              </a>
            ) : (
              <button className="text-red-600 hover:underline font-semibold">
                📄 Completar perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default InformacionGeneral;