import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";     
import { AlertCircle, Loader, ArrowLeft, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, Languages } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { getFreelancerProfile } from "@/api/freelancerApi";
import MainLayout from "@/components/Layouts/MainLayout";

function ViewMoreDetailsFreelancer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [id_usuario, setIdUsuario] = useState(null);
  const [perfilData, setPerfilData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem("token");
      setIsAuthenticated(!!token);

      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserType(decoded.tipo_usuario);
          setIdUsuario(decoded.id_usuario);

          if (decoded.id_usuario) {
            await fetchPerfilCompleto(decoded.id_usuario);
          }
        } catch (error) {
          console.error("Error decodificando token:", error);
          setError("Error al verificar sesión");
          sessionStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }

      setLoading(false);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const fetchPerfilCompleto = async (id_usuario) => {
    try {
      const response = await getFreelancerProfile(id_usuario);
      setPerfilData(response);
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      setError("Error al cargar el perfil");
    }
  };

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return navigate("/notauthenticated")
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <MainLayout>
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start gap-4">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
              <div>
                <h2 className="font-bold text-red-900 mb-2 text-lg">Error al cargar perfil</h2>
                <p className="text-red-800 mb-4">{error}</p>
                <button 
                  onClick={() => navigate("/freelancer-profile/view-profile")} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    );
  }

  if (!perfilData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <MainLayout>
          <div className="flex justify-center items-center py-32">
            <Loader className="animate-spin text-[#07767c]" size={40} />
          </div>
        </MainLayout>
      </div>
    );
  }

  const freelancer = perfilData.freelancer || {};
  const personal = perfilData.antecedentes_personales || {};
  const educacion_sup = perfilData.educacion_superior || {};
  const trabajo = perfilData.trabajo_practica || {};
  const idiomas = perfilData.idiomas || [];
  const habilidades = perfilData.habilidades || [];
  const cursos = perfilData.cursos || [];
  const pretensiones = perfilData.pretensiones || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <MainLayout>
        <main className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header con botón volver */}
            <div className="mb-8">
              <button 
                onClick={() => navigate("/freelancer-profile/view-profile")} 
                className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#07767c] transition-colors font-medium mb-4"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Volver a mi perfil
              </button>
              <h1 className="text-4xl font-bold text-gray-900">Perfil Completo</h1>
              <p className="text-gray-600 mt-2">Vista detallada de toda tu información profesional</p>
            </div>

            {/* Presentación */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Presentación</h2>
                  <p className="text-sm text-gray-500">Tu carta de presentación profesional</p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6 text-base">
                {freelancer.descripcion_freelancer || 'No hay descripción disponible'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-[#07767c]" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Correo de contacto</p>
                    <p className="font-semibold text-gray-900">{freelancer.correo_contacto || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-[#07767c]" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Teléfono de contacto</p>
                    <p className="font-semibold text-gray-900">{freelancer.telefono_contacto || 'No especificado'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Datos Personales */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Datos Personales</h2>
                  <p className="text-sm text-gray-500">Información personal y de contacto</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                  <p className="text-base font-semibold text-gray-900">{personal.nombres} {personal.apellidos}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-gray-500">Identificación</p>
                  <p className="text-base font-semibold text-gray-900">{personal.identificacion || 'No especificada'}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-gray-500">Ubicación</p>
                  <p className="text-base font-semibold text-gray-900">{personal.ciudad_freelancer}, {personal.comuna}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-gray-500">Nacionalidad</p>
                  <p className="text-base font-semibold text-gray-900">{personal.nacionalidad || 'No especificada'}</p>
                </div>
              </div>
            </div>

            {/* Educación Superior */}
            {educacion_sup.institucion_superior && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Educación Superior</h2>
                    <p className="text-sm text-gray-500">Formación académica universitaria</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-500">Institución</p>
                    <p className="text-base font-semibold text-gray-900">{educacion_sup.institucion_superior}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-500">Carrera</p>
                    <p className="text-base font-semibold text-gray-900">{educacion_sup.carrera}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold w-fit">
                      {educacion_sup.estado_superior}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-500">Período</p>
                    <p className="text-base font-semibold text-gray-900">
                      {educacion_sup.ano_inicio_superior} - {educacion_sup.ano_termino_superior}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Experiencia Laboral */}
            {trabajo.experiencia_laboral === "Si" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Experiencia Laboral</h2>
                    <p className="text-sm text-gray-500">Historial profesional</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-500">Empresa</p>
                    <p className="text-base font-semibold text-gray-900">{trabajo.empresa}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-500">Cargo</p>
                    <p className="text-base font-semibold text-gray-900">{trabajo.cargo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Idiomas */}
            {idiomas.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Languages className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Idiomas</h2>
                    <p className="text-sm text-gray-500">Competencias lingüísticas</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {idiomas.map((idioma, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                      <p className="font-semibold text-gray-900 text-base">{idioma.idioma}</p>
                      <span className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                        {idioma.nivel_idioma}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Habilidades */}
            {habilidades.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Habilidades</h2>
                    <p className="text-sm text-gray-500">Competencias técnicas y blandas</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {habilidades.map((hab, idx) => (
                    <div key={idx} className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-400 transition-all hover:shadow-md">
                      <p className="font-bold text-gray-900 mb-2 text-base">{hab.habilidad}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-3 py-1 bg-white border border-green-300 text-green-700 rounded-lg font-medium">
                          {hab.categoria}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-700 font-medium">{hab.nivel_habilidad}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cursos y Certificaciones */}
            {cursos && cursos.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cursos y Certificaciones</h2>
                    <p className="text-sm text-gray-500">Formación complementaria</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {cursos.map((curso, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0 hover:bg-gray-50 -mx-4 px-4 py-3 rounded-lg transition-colors">
                      <p className="font-bold text-gray-900 mb-1 text-base">{curso.nombre_curso}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{curso.institucion_curso}</span>
                        <span>•</span>
                        <span>{curso.mes_inicio_curso} {curso.ano_inicio_curso}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pretensiones Laborales */}
            <div className="bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-2xl border border-[#07767c] p-8 shadow-md">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Pretensiones Laborales</h2>
                  <p className="text-sm text-white/80">Expectativas y disponibilidad</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-white/70">Disponibilidad</p>
                  <p className="text-lg font-bold text-white">{pretensiones.disponibilidad || 'No especificada'}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-white/70">Renta esperada</p>
                  <p className="text-lg font-bold text-white">
                    ${pretensiones.renta_esperada?.toLocaleString("es-CL") || 'A convenir'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </MainLayout>
    </div>
  );
}

export default ViewMoreDetailsFreelancer;