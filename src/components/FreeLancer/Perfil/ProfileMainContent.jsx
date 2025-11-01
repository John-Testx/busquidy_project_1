import { AlertCircle } from "lucide-react";
import InformacionGeneral from "./PerfilSections/InformacionGeneral";
import Presentacion from "./PerfilSections/Presentacion";
import InclusionLaboral from "./PerfilSections/InclusionLaboral";
import ExperienciaLaboral from "./PerfilSections/ExperienciaLaboral";
import Emprendimiento from "./PerfilSections/Emprendimiento";
import FormacionAcademica from "./PerfilSections/FormacionAcademica";
import Conocimientos from "./PerfilSections/Conocimientos";
import CursosCertificaciones from "./PerfilSections/CursosCertificaciones";
import PretensionesLaborales from "./PerfilSections/PretensionesLaborales";
import { calculateCompleteness } from "@/utils/profileUtils";

function ProfileMainContent({ perfilData }) {
  const completeness = calculateCompleteness(perfilData);

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Advertencia si el perfil está incompleto */}
      {completeness < 100 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-yellow-800 text-sm">
              <strong>Perfil incompleto:</strong> Completa todas las secciones para aumentar tus oportunidades. 
              Si tienes dudas escríbenos a <a href="mailto:busquidy@soporte.com" className="underline">busquidy@soporte.com</a>
            </p>
          </div>
        </div>
      )}

      <InformacionGeneral perfilData={perfilData} />
      <Presentacion perfilData={perfilData} />
      <InclusionLaboral perfilData={perfilData} />
      <ExperienciaLaboral perfilData={perfilData} />
      <Emprendimiento perfilData={perfilData} />
      <FormacionAcademica perfilData={perfilData} />
      <Conocimientos perfilData={perfilData} />
      <CursosCertificaciones perfilData={perfilData} />
      <PretensionesLaborales perfilData={perfilData} />
    </div>
  );
}

export default ProfileMainContent;