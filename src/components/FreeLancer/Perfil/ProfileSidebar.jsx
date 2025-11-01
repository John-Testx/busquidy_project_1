import { Edit, Upload, CheckCircle, XCircle } from "lucide-react";
import { calculateCompleteness } from "@/utils/profileUtils";

function ProfileSidebar({ perfilData }) {
  const completeness = calculateCompleteness(perfilData);
  const personal = perfilData.antecedentesPersonales || {};
  const freelancer = perfilData.freelancer || {};
  const trabajo = perfilData.trabajoPractica || [];
  const educacion_sup = perfilData.educacionSuperior || [];
  const educacion_basica = perfilData.educacionBasicaMedia || [];
  const idiomas = perfilData.idiomas || [];
  const habilidades = perfilData.habilidades || [];
  const inclusion = perfilData.inclusionLaboral || {};

  const sections = [
    { name: 'Información general', completed: !!personal.nombres },
    { name: 'Presentación', completed: !!freelancer.descripcion },
    { name: 'Inclusión laboral', completed: !!inclusion.discapacidad },
    { name: 'Experiencia laboral', completed: trabajo.length > 0 },
    { name: 'Educación superior', completed: educacion_sup.length > 0 },
    { name: 'Idiomas', completed: idiomas.length > 0 },
    { name: 'Habilidades', completed: habilidades.length > 0 },
  ];

  const optionalSections = [
    { name: 'Educación básica y media', completed: educacion_basica.length > 0 },
    { name: 'Información adicional', completed: false },
  ];

  const interests = [
    { name: 'Ofertas de empleo', completed: true },
    { name: 'Prácticas', completed: true },
    { name: 'Trabajo para estudiantes', completed: true },
  ];

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 sticky top-24">
        {/* Foto de Perfil */}
        <div className="text-center mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Foto de Perfil</h3>
          <button className="ml-auto text-sm text-gray-600 hover:text-[#07767c] flex items-center gap-1 mb-4">
            <Edit size={16} />
            Cambiar
          </button>
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4">
            {personal.nombres?.charAt(0) || 'U'}
          </div>
          
          {/* Barra de Progreso */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-gray-900">{completeness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Este porcentaje de completitud es solo una referencia y no tiene relación con lo adecuado de tu perfil.
              Te recomendamos completarlo lo mejor posible.
            </p>
          </div>

          {/* Descargar CV */}
          {freelancer.cv_url && (
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors mb-3">
              Descargar currículum
            </button>
          )}

          {/* Cambiar CV */}
          <button className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Upload size={18} />
            Cambiar CV (CV adjunto)
          </button>
        </div>

        {/* Curriculum Sections */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-bold text-gray-900 mb-3">Currículum</h3>
          <div className="space-y-2">
            {sections.map((section, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className={section.completed ? 'text-red-600' : 'text-gray-400'}>
                  {section.name}
                </span>
                {section.completed ? (
                  <CheckCircle size={16} className="text-red-600" />
                ) : (
                  <XCircle size={16} className="text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Secciones Opcionales */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-bold text-gray-900 mb-3">Opcionales</h3>
          <div className="space-y-2">
            {optionalSections.map((section, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className={section.completed ? 'text-red-600' : 'text-gray-400'}>
                  {section.name}
                </span>
                {section.completed ? (
                  <CheckCircle size={16} className="text-red-600" />
                ) : (
                  <XCircle size={16} className="text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preferencias */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-bold text-gray-900 mb-3">Estoy interesado/a en</h3>
          <div className="space-y-2">
            {interests.map((section, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className={section.completed ? 'text-red-600' : 'text-gray-400'}>
                  {section.name}
                </span>
                {section.completed ? (
                  <CheckCircle size={16} className="text-red-600" />
                ) : (
                  <XCircle size={16} className="text-gray-300" />
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
            Modificar preferencias
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;