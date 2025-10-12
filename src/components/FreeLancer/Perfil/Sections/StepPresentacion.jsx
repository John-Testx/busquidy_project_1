import React from "react";
import { Mail, Phone, Linkedin } from "lucide-react";

function StepPresentacion({ freelancerData, handleChange }) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="descripcion_freelancer" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción Profesional <span className="text-red-500">*</span>
        </label>
        <textarea
          id="descripcion_freelancer"
          name="descripcion_freelancer"
          rows={6}
          placeholder="Cuéntanos sobre ti, tu experiencia, habilidades y qué te hace único como profesional..."
          value={freelancerData.freelancer.descripcion_freelancer}
          onChange={(e) => handleChange(e, "freelancer")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          Esta descripción será lo primero que vean las empresas en tu perfil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="correo_contacto" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              Correo de Contacto <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="email"
            id="correo_contacto"
            name="correo_contacto"
            placeholder="tu.correo@ejemplo.com"
            value={freelancerData.freelancer.correo_contacto}
            onChange={(e) => handleChange(e, "freelancer")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="telefono_contacto" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              Teléfono de Contacto <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="tel"
            id="telefono_contacto"
            name="telefono_contacto"
            placeholder="+56 9 1234 5678"
            value={freelancerData.freelancer.telefono_contacto}
            onChange={(e) => handleChange(e, "freelancer")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="linkedin_link" className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Linkedin size={16} />
            Perfil de LinkedIn
            <span className="text-gray-400 text-xs">(Opcional)</span>
          </div>
        </label>
        <input
          type="url"
          id="linkedin_link"
          name="linkedin_link"
          placeholder="https://linkedin.com/in/tu-perfil"
          value={freelancerData.freelancer.linkedin_link}
          onChange={(e) => handleChange(e, "freelancer")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

export default StepPresentacion;