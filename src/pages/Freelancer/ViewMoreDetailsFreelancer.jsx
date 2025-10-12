import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";     
import { AlertCircle, Loader } from "lucide-react";
import Navbar from "../../components/Home/Navbar";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen";
import { getFreelancerProfile } from "../../api/freelancerApi";

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
      const token = localStorage.getItem("token");
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
          localStorage.removeItem("token");
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Debes iniciar sesión</h1>
          <button onClick={() => navigate("/login")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h2 className="font-bold text-red-900 mb-2">Error</h2>
              <p className="text-red-800 mb-4">{error}</p>
              <button onClick={() => navigate("/viewperfilfreelancer")} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Volver
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!perfilData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="flex justify-center items-center py-32">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
        <Footer />
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate("/perfil-freelancer")} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              ← Volver
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Tu Perfil Completo</h1>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Presentación</h2>
            <p className="text-gray-700 mb-4">{freelancer.descripcion_freelancer}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Correo</p>
                <p className="font-medium text-gray-900">{freelancer.correo_contacto}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium text-gray-900">{freelancer.telefono_contacto}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos Personales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Nombre completo</p>
                <p className="font-medium text-gray-900">{personal.nombres} {personal.apellidos}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Identificación</p>
                <p className="font-medium text-gray-900">{personal.identificacion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="font-medium text-gray-900">{personal.ciudad_freelancer}, {personal.comuna}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nacionalidad</p>
                <p className="font-medium text-gray-900">{personal.nacionalidad}</p>
              </div>
            </div>
          </div>

          {educacion_sup.institucion_superior && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Educación Superior</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Institución</p>
                  <p className="font-medium text-gray-900">{educacion_sup.institucion_superior}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carrera</p>
                  <p className="font-medium text-gray-900">{educacion_sup.carrera}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="font-medium text-gray-900">{educacion_sup.estado_superior}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Período</p>
                  <p className="font-medium text-gray-900">{educacion_sup.ano_inicio_superior} - {educacion_sup.ano_termino_superior}</p>
                </div>
              </div>
            </div>
          )}

          {trabajo.experiencia_laboral === "Si" && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experiencia Laboral</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Empresa</p>
                  <p className="font-medium text-gray-900">{trabajo.empresa}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cargo</p>
                  <p className="font-medium text-gray-900">{trabajo.cargo}</p>
                </div>
              </div>
            </div>
          )}

          {idiomas.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Idiomas</h2>
              <div className="space-y-3">
                {idiomas.map((idioma, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                    <p className="font-medium text-gray-900">{idioma.idioma}</p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{idioma.nivel_idioma}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {habilidades.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Habilidades</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habilidades.map((hab, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <p className="font-medium text-gray-900">{hab.habilidad}</p>
                    <p className="text-sm text-gray-600">{hab.categoria} • {hab.nivel_habilidad}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cursos && cursos.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cursos y Certificaciones</h2>
              <div className="space-y-4">
                {cursos.map((curso, idx) => (
                  <div key={idx} className="pb-4 border-b last:border-b-0">
                    <p className="font-medium text-gray-900">{curso.nombre_curso}</p>
                    <p className="text-sm text-gray-600">{curso.institucion_curso} • {curso.mes_inicio_curso} {curso.ano_inicio_curso}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pretensiones Laborales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Disponibilidad</p>
                <p className="font-medium text-gray-900">{pretensiones.disponibilidad}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Renta esperada</p>
                <p className="font-medium text-gray-900">${pretensiones.renta_esperada?.toLocaleString("es-CL")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ViewMoreDetailsFreelancer;