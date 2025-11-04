import { useState } from 'react';
import { X, Briefcase, GraduationCap, Users } from 'lucide-react';

function ModalPreferencias({ isOpen, onClose, currentPreferencias, onSave }) {
  const [preferencias, setPreferencias] = useState({
    ofertas_empleo: currentPreferencias?.ofertas_empleo ?? true,
    practicas: currentPreferencias?.practicas ?? true,
    trabajo_estudiantes: currentPreferencias?.trabajo_estudiantes ?? true
  });

  if (!isOpen) return null;

  const handleToggle = (key) => {
    setPreferencias(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(preferencias);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#07767c] to-[#40E0D0] px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-white">Modificar Preferencias</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-6">
            Selecciona los tipos de oportunidades laborales en las que estás interesado/a:
          </p>

          <div className="space-y-4">
            {/* Ofertas de Empleo */}
            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#07767c] transition-colors">
              <div className="flex items-center gap-3">
                <Briefcase className="text-[#07767c]" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Ofertas de empleo</p>
                  <p className="text-sm text-gray-600">Puestos de trabajo permanentes</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferencias.ofertas_empleo}
                onChange={() => handleToggle('ofertas_empleo')}
                className="w-5 h-5 text-[#07767c] rounded focus:ring-[#07767c]"
              />
            </label>

            {/* Prácticas */}
            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#07767c] transition-colors">
              <div className="flex items-center gap-3">
                <GraduationCap className="text-[#07767c]" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Prácticas</p>
                  <p className="text-sm text-gray-600">Prácticas profesionales</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferencias.practicas}
                onChange={() => handleToggle('practicas')}
                className="w-5 h-5 text-[#07767c] rounded focus:ring-[#07767c]"
              />
            </label>

            {/* Trabajo para Estudiantes */}
            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#07767c] transition-colors">
              <div className="flex items-center gap-3">
                <Users className="text-[#07767c]" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Trabajo para estudiantes</p>
                  <p className="text-sm text-gray-600">Trabajos part-time compatibles con estudios</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferencias.trabajo_estudiantes}
                onChange={() => handleToggle('trabajo_estudiantes')}
                className="w-5 h-5 text-[#07767c] rounded focus:ring-[#07767c]"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#05595d] transition-colors font-semibold"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPreferencias;