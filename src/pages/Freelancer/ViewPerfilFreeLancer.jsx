import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import ModalCreatePerfilFreelancer from "@/components/FreeLancer/Perfil/ModalCreatePerfilFreelancer";
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
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h2 className="font-bold text-yellow-900 mb-2">Acceso restringido</h2>
            <p className="text-yellow-800">Esta sección solo está disponible para usuarios freelancer.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h2 className="font-bold text-red-900 mb-2">Error</h2>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Perfil Incompleto
  if (isPerfilIncompleto) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {!creationMethod ? (
            <ProfileCreationOptions onSelectMethod={handleSelectCreationMethod} />
          ) : creationMethod === 'cv' ? (
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

  // RENDER: Loading perfil completo
  if (!perfilData) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-[#07767c]" size={40} />
      </div>
    );
  }

  // RENDER: Perfil Completo
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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