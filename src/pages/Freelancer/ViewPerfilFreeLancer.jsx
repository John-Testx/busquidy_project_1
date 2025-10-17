import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader, FileText, User, Briefcase, Eye, Upload, Edit } from "lucide-react";
import Navbar from "../../components/Home/Navbar";
import Footer from "../../components/Home/Footer";
import CreateProfileCv from "../../components/FreeLancer/Perfil/CreateProfileCv";
import LoadingScreen from "../../components/LoadingScreen";
import ModalCreatePerfilFreelancer from "../../components/FreeLancer/Perfil/ModalCreatePerfilFreelancer";
import { checkProfileExists, getFreelancerProfile } from "../../api/freelancerApi";
import useAuth from "../../hooks/useAuth";

function ViewPerfilFreeLancer() {
  const navigate = useNavigate();

  // Authentication data 
  const {
    isAuthenticated,
    tipo_usuario: userType,
    id_usuario,
    loading,
    refresh,
  } = useAuth();

  // ✅ Component state
  const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
  const [perfilData, setPerfilData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCvUpload, setShowCvUpload] = useState(false);
  const [creationMethod, setCreationMethod] = useState(null); // 'form' or 'cv'

  // ✅ Fetch freelancer profile once authenticated and id_usuario is known
  useEffect(() => {
    if (!loading && isAuthenticated && id_usuario) {
      fetchPerfilFreelancer(id_usuario);
    }
  }, [loading, isAuthenticated, id_usuario]);

  const fetchPerfilFreelancer = async (id) => {
    try {
      const response = await checkProfileExists(id);
      setIsPerfilIncompleto(response.isPerfilIncompleto);

      if (!response.isPerfilIncompleto) {
        const perfilCompleto = await getFreelancerProfile(id);
        console.log(perfilCompleto);
        setPerfilData(perfilCompleto.data);
      }
    } catch (err) {
      console.error("Error verificando perfil:", err);
      setError("Error al verificar perfil");
    }
  };

  const handleSelectCreationMethod = (method) => {
    setCreationMethod(method);
    if (method === "form") {
      setShowModal(true);
      setShowCvUpload(false);
    } else if (method === "cv") {
      setShowCvUpload(true);
      setShowModal(false);
    }
  };

  if (loading) return <LoadingScreen />;
  
  if (userType !== "freelancer") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h2 className="font-bold text-yellow-900 mb-2">Acceso restringido</h2>
              <p className="text-yellow-800">Esta sección solo está disponible para usuarios freelancer.</p>
            </div>
          </div>
        </div>
        <Footer />
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
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="pt-20 pb-12">
        {isPerfilIncompleto === null ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : isPerfilIncompleto ? (
          // PERFIL INCOMPLETO - Mostrar opciones de creación
          <div className="max-w-4xl mx-auto px-4">
            {!creationMethod ? (
              // Selector de método de creación
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
                  {/* Opción: Formulario */}
                  <button
                    onClick={() => handleSelectCreationMethod('form')}
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

                  {/* Opción: Subir CV */}
                  <button
                    onClick={() => handleSelectCreationMethod('cv')}
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
            ) : creationMethod === 'cv' ? (
              // Mostrar componente de subida de CV
              <div>
                <button
                  onClick={() => setCreationMethod(null)}
                  className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ← Volver a opciones
                </button>
                <CreateProfileCv id_usuario={id_usuario} />
              </div>
            ) : null}
          </div>
        ) : (
          // PERFIL COMPLETO - Mostrar vista del perfil
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Mi Perfil Profesional</h1>

            {/* Tarjeta de Presentación */}
            {perfilData && (
              <>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {perfilData.antecedentesPersonales?.nombres?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {perfilData.antecedentesPersonales?.nombres} {perfilData.antecedentesPersonales?.apellidos}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {perfilData.freelancer?.descripcion}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User size={18} />
                          <span>{perfilData.antecedentesPersonales?.ciudad}, {perfilData.antecedentesPersonales?.comuna}</span>
                        </div>
                        {/* CORREGIDO: Acceso a un array */}
                        {perfilData.educacionSuperior && perfilData.educacionSuperior.length > 0 && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Briefcase size={18} />
                            <span>{perfilData.educacionSuperior[0].carrera}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información Rápida */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {perfilData.idiomas && perfilData.idiomas.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Idiomas</h3>
                      <div className="space-y-2">
                        {perfilData.idiomas.slice(0, 2).map((idioma, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            {idioma.idioma} - {idioma.nivel}
                          </div>
                        ))}
                        {perfilData.idiomas.length > 2 && (
                          <p className="text-xs text-gray-500">+{perfilData.idiomas.length - 2} más</p>
                        )}
                      </div>
                    </div>
                  )}

                  {perfilData.habilidades && perfilData.habilidades.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Habilidades</h3>
                      <div className="flex flex-wrap gap-2">
                        {perfilData.habilidades.slice(0, 3).map((hab, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {hab.habilidad}
                          </span>
                        ))}
                        {perfilData.habilidades.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{perfilData.habilidades.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {perfilData.pretensiones && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Pretensiones</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div>
                          <span className="font-medium">Disponibilidad:</span><br />
                          {perfilData.pretensiones.disponibilidad}
                        </div>
                        <div>
                          <span className="font-medium">Renta esperada:</span><br />
                          ${perfilData.pretensiones.renta_esperada?.toLocaleString("es-CL")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate("/viewmoredetailsfreelancer")}
                    className="px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Eye size={20} />
                    Ver Perfil Completo
                  </button>
                  <button
                    onClick={() => {
                      // Aquí puedes agregar lógica para editar perfil
                      console.log("Editar perfil");
                    }}
                    className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <Edit size={20} />
                    Editar Perfil
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />

      {/* Modal de Formulario */}
      {showModal && (
        <ModalCreatePerfilFreelancer 
          closeModal={() => {
            setShowModal(false);
            setCreationMethod(null);
          }} 
          id_usuario={id_usuario} 
        />
      )}
    </div>
  );
}

export default ViewPerfilFreeLancer;