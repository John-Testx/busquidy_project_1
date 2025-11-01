import { FileText, Edit, Upload } from "lucide-react";

function ProfileCreationOptions({ onSelectMethod }) {
  return (
    <>
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FileText className="text-blue-600" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Crea tu Perfil Profesional</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Elige cómo deseas crear tu perfil. Puedes completar un formulario detallado o subir tu CV existente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <button
          onClick={() => onSelectMethod('form')}
          className="p-8 bg-white border-2 border-blue-200 rounded-xl hover:shadow-xl transition-all text-left group hover:border-blue-500"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
            <Edit className="text-blue-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Completar Formulario</h3>
          <p className="text-gray-600 mb-4">
            Completa un formulario paso a paso con toda tu información profesional, educación, experiencia y habilidades.
          </p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              Guía paso a paso
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              Control total sobre tu información
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              Perfil estructurado y completo
            </li>
          </ul>
          <div className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
            Comenzar formulario →
          </div>
        </button>

        <button
          onClick={() => onSelectMethod('cv')}
          className="p-8 bg-white border-2 border-indigo-200 rounded-xl hover:shadow-xl transition-all text-left group hover:border-indigo-500"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 group-hover:bg-indigo-200 transition-colors">
            <Upload className="text-indigo-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Subir CV</h3>
          <p className="text-gray-600 mb-4">
            Sube tu CV en formato PDF o Word. Rápido y sencillo, ideal si ya tienes tu currículum actualizado.
          </p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              Proceso rápido
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              Formatos PDF, DOC, DOCX
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              Listo en minutos
            </li>
          </ul>
          <div className="text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
            Subir archivo →
          </div>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-blue-800">
          💡 <strong>Consejo:</strong> Si es tu primera vez, te recomendamos usar el formulario para asegurar que incluyas toda la información importante.
        </p>
      </div>
    </>
  );
}

export default ProfileCreationOptions;