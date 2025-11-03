import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import ModalCreatePerfilFreelancer from "@components/FreeLancer/Perfil/ModalCreatePerfilFreelancer";
import { checkProfileExists, getFreelancerProfile } from "@/api/freelancerApi";
import { useAuth } from "@/hooks";
// Componentes para perfil incompleto
import ProfileCreationOptions from "@components/FreeLancer/Perfil/ProfileCreationOptions";
import CreateProfileCv from "@/components/FreeLancer/Perfil/CreateProfileCv";
// Componentes para perfil completo
import ProfileSidebar from "@/components/FreeLancer/Perfil/ProfileSidebar";
import ProfileMainContent from "@/components/FreeLancer/Perfil/ProfileMainContent";

function ViewPerfilFreeLancer() {
  const navigate = useNavigate();
  const { isAuthenticated, tipo_usuario: userType, id_usuario, loading } = useAuth();
  const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
  const [perfilData, setPerfilData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creationMethod, setCreationMethod] = useState(null);

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
    }
  };

  if (loading) return <LoadingScreen />;
  
  if (userType !== "freelancer") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-yellow-200 p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-yellow-600" size={28} />
              </div>
              <div>
                <h2 className="font-bold text-yellow-900 text-2xl mb-3">Acceso Restringido</h2>
                <p className="text-yellow-800 text-lg mb-6">
                  Esta sección solo está disponible para usuarios freelancer. Por favor, verifica tu tipo de cuenta.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-200 p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600" size={28} />
              </div>
              <div>
                <h2 className="font-bold text-red-900 text-2xl mb-3">Error al Cargar Perfil</h2>
                <p className="text-red-800 text-lg mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Perfil Incompleto (con fondo colorido)
  if (isPerfilIncompleto) {
    return (
      <>
        {!creationMethod ? (
          <ProfileCreationOptions onSelectMethod={handleSelectCreationMethod} />
        ) : creationMethod === 'cv' ? (
          <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => setCreationMethod(null)}
                className="mb-6 px-5 py-2.5 text-[#07767c] hover:text-white bg-white hover:bg-[#07767c] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold border-2 border-[#07767c] flex items-center gap-2"
              >
                <span className="text-lg">←</span>
                Volver a opciones
              </button>
              <CreateProfileCv id_usuario={id_usuario} />
            </div>
          </div>
        ) : null}

        {showModal && (
          <ModalCreatePerfilFreelancer 
            closeModal={() => {
              setShowModal(false);
              setCreationMethod(null);
            }} 
            id_usuario={id_usuario} 
          />
        )}
      </>
    );
  }

  // RENDER: Loading perfil completo (sin fondo colorido)
  if (!perfilData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center py-20">
        <div className="text-center">
          <Loader className="animate-spin text-[#07767c] mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg font-medium">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  // RENDER: Perfil Completo (fondo gris/blanco neutro)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileSidebar perfilData={perfilData} />
          <ProfileMainContent perfilData={perfilData} />
        </div>
      </div>

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