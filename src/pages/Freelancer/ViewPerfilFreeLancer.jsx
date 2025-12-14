import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import ModalCreatePerfilFreelancer from "@components/FreeLancer/Perfil/ModalCreatePerfilFreelancer";
import { checkProfileExists } from "@/api/freelancerApi";
import { useAuth } from "@/hooks";
import useFreelancerProfile from '@/hooks/freelancer/useFreelancerProfile';
import ModalGestionSeccion from '@/components/FreeLancer/Perfil/ModalGestionSeccion';

// Componentes para perfil incompleto
import ProfileCreationOptions from "@components/FreeLancer/Perfil/ProfileCreationOptions";
import CreateProfileCv from "@/components/FreeLancer/Perfil/CreateProfileCv";

// Componentes para perfil completo
import ProfileSidebar from '@/components/FreeLancer/Perfil/ProfileSidebar';
import InformacionGeneral from '@/components/FreeLancer/Perfil/PerfilSections/InformacionGeneral';
import Presentacion from '@/components/FreeLancer/Perfil/PerfilSections/Presentacion';
import ExperienciaLaboral from '@/components/FreeLancer/Perfil/PerfilSections/ExperienciaLaboral';
import FormacionAcademica from '@/components/FreeLancer/Perfil/PerfilSections/FormacionAcademica';
import Conocimientos from '@/components/FreeLancer/Perfil/PerfilSections/Conocimientos';
import CursosCertificaciones from '@/components/FreeLancer/Perfil/PerfilSections/CursosCertificaciones';
import PretensionesLaborales from '@/components/FreeLancer/Perfil/PerfilSections/PretensionesLaborales';
import InclusionLaboral from '@/components/FreeLancer/Perfil/PerfilSections/InclusionLaboral';
import Emprendimiento from '@/components/FreeLancer/Perfil/PerfilSections/Emprendimiento';

function ViewPerfilFreeLancer() {
  const navigate = useNavigate();
  const { isAuthenticated, tipo_usuario: userType, id_usuario, loading } = useAuth();
  
  const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creationMethod, setCreationMethod] = useState(null);

  // ✅ Hook que maneja TODO el perfil (incluye las nuevas funciones)
  const {
    freelancer,
    loading: loadingProfile,
    error: profileError,
    photoUrl,                      // ✅ NUEVA: URL de la foto
    preferencias,                   // ✅ NUEVA: Preferencias del usuario
    modalState,
    openAddModal,
    openEditModal,
    closeModal,
    handleAddSubmit,
    handleEditSubmit,
    handleDelete,
    handleUploadPhoto,              // ✅ NUEVA: Función para subir foto
    handleDownloadCV,               // ✅ NUEVA: Función para descargar CV
    handleUpdatePreferencias,       // ✅ NUEVA: Función para actualizar preferencias
    refreshProfile
  } = useFreelancerProfile(id_usuario);

  // ✅ NUEVA: Handler para cambiar CV
  const handleChangeCV = () => {
    // Puedes navegar a una página específica o abrir un modal
    // Por ahora, simplemente recarga para volver a subir CV
    setCreationMethod('cv');
    setIsPerfilIncompleto(true);
  };

  useEffect(() => {
    if (!loading && isAuthenticated && id_usuario) {
      fetchPerfilFreelancer(id_usuario);
    }
  }, [loading, isAuthenticated, id_usuario]);

  const fetchPerfilFreelancer = async (id) => {
    try {
      const response = await checkProfileExists(id);
      setIsPerfilIncompleto(response.isPerfilIncompleto);
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
                  Esta sección solo está disponible para usuarios estudiantes.
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

  // PERFIL INCOMPLETO
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

  if (loadingProfile && !freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center py-20">
        <div className="text-center">
          <Loader className="animate-spin text-[#07767c] mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg font-medium">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{profileError}</p>
          <button 
            onClick={refreshProfile}
            className="mt-4 px-4 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#05595d] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No se encontró el perfil del estudiante</p>
      </div>
    );
  }

  const handleModalSubmit = modalState.mode === 'add' ? handleAddSubmit : handleEditSubmit;

  // ✅ PERFIL COMPLETO CON LAYOUT DE 3 COLUMNAS
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid de 3 columnas: Sidebar izquierdo + Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ✅ SIDEBAR IZQUIERDO - AHORA CON TODAS LAS PROPS NECESARIAS */}
          <ProfileSidebar 
            perfilData={freelancer}
            photoUrl={photoUrl}                        // ✅ URL de la foto
            preferencias={preferencias}                 // ✅ Preferencias del usuario
            onUploadPhoto={handleUploadPhoto}          // ✅ Función para subir foto
            onDownloadCV={handleDownloadCV}            // ✅ Función para descargar CV
            onChangeCV={handleChangeCV}                // ✅ Función para cambiar CV
            onUpdatePreferencias={handleUpdatePreferencias} // ✅ Función para actualizar preferencias
          />

          {/* CONTENIDO PRINCIPAL (2 columnas) */}
          <div className="lg:col-span-2 space-y-6">
            <InformacionGeneral 
              perfilData={freelancer}
              openEditModal={openEditModal}
            />
            
            <Presentacion 
              perfilData={freelancer}
              openEditModal={openEditModal}
            />
            
            <ExperienciaLaboral 
              perfilData={freelancer}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              handleDelete={handleDelete}
            />
            
            <FormacionAcademica 
              perfilData={freelancer}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              handleDelete={handleDelete}
            />
            
            <Conocimientos 
              perfilData={freelancer}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              handleDelete={handleDelete}
            />
            
            <CursosCertificaciones 
              perfilData={freelancer}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              handleDelete={handleDelete}
            />
            
            <PretensionesLaborales 
              perfilData={freelancer}
              openEditModal={openEditModal}
            />
            
            <InclusionLaboral 
              perfilData={freelancer}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
            />
            
            <Emprendimiento 
              perfilData={freelancer}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
            />
          </div>
        </div>
      </div>

      {/* Modal de Gestión */}
      <ModalGestionSeccion
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        sectionName={modalState.sectionName}
        currentItem={modalState.currentItem}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default ViewPerfilFreeLancer;