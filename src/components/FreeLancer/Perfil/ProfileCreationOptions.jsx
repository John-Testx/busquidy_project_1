import { FileText, Edit, Upload, Sparkles } from "lucide-react";

function ProfileCreationOptions({ onSelectMethod }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-2xl mb-6 shadow-lg">
            <FileText className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Crea tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07767c] to-[#40E0D0]">Perfil Profesional</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige cómo deseas crear tu perfil. Puedes completar un formulario detallado o subir tu CV existente.
          </p>
        </div>

        {/* Opciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Opción Formulario */}
          <button
            onClick={() => onSelectMethod('form')}
            className="p-10 bg-white border-2 border-gray-200 rounded-2xl hover:shadow-2xl hover:border-[#07767c] hover:-translate-y-2 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <Edit className="text-white" size={32} />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-bold text-gray-900">Completar Formulario</h3>
              <Sparkles className="text-[#07767c] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              Completa un formulario paso a paso con toda tu información profesional, educación, experiencia y habilidades.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Guía paso a paso intuitiva',
                'Control total sobre tu información',
                'Perfil estructurado y profesional',
                '12 secciones detalladas'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[#07767c] font-bold text-lg group-hover:gap-4 transition-all">
              Comenzar formulario
              <span className="text-2xl">→</span>
            </div>
          </button>

          {/* Opción CV */}
          <button
            onClick={() => onSelectMethod('cv')}
            className="p-10 bg-white border-2 border-gray-200 rounded-2xl hover:shadow-2xl hover:border-[#40E0D0] hover:-translate-y-2 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <Upload className="text-white" size={32} />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-bold text-gray-900">Subir CV</h3>
              <Sparkles className="text-[#40E0D0] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              Sube tu CV en formato PDF o Word. Rápido y sencillo, ideal si ya tienes tu currículum actualizado.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Proceso súper rápido',
                'Formatos: PDF, DOC, DOCX',
                'Máximo 5MB de tamaño',
                'Listo en minutos'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[#40E0D0] font-bold text-lg group-hover:gap-4 transition-all">
              Subir archivo
              <span className="text-2xl">→</span>
            </div>
          </button>
        </div>

        {/* Consejo */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#07767c]/10 to-[#40E0D0]/10 border-2 border-[#07767c]/30 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-[#07767c] text-xl mb-2">Consejo Importante</h3>
              <p className="text-gray-700 text-lg">
                Si es tu primera vez, te recomendamos usar el <strong>formulario paso a paso</strong> para asegurar que incluyas toda la información importante y crear un perfil profesional completo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCreationOptions;