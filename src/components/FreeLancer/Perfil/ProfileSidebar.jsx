import { useState, useRef } from "react";
import { Edit, Upload, Download, CheckCircle, XCircle, Camera, Settings } from "lucide-react";
import { calculateCompleteness } from "@/utils/profileUtils";
import ModalPreferencias from "./ModalPreferencias";

function ProfileSidebar({ 
  perfilData, 
  photoUrl, 
  preferencias,
  onUploadPhoto, 
  onDownloadCV, 
  onChangeCV,
  onUpdatePreferencias 
}) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const fileInputRef = useRef(null);

  const completeness = calculateCompleteness(perfilData);
  const personal = perfilData.antecedentesPersonales || {};
  const freelancer = perfilData.freelancer || {};
  const trabajo = perfilData.trabajoPractica || [];
  const educacion_sup = perfilData.educacionSuperior || [];
  const educacion_basica = perfilData.educacionBasicaMedia || [];
  const idiomas = perfilData.idiomas || [];
  const habilidades = perfilData.habilidades || [];
  const inclusion = perfilData.inclusionLaboral || {};

  const sections = [
    { name: 'Información general', completed: !!personal.nombres },
    { name: 'Presentación', completed: !!freelancer.descripcion },
    { name: 'Inclusión laboral', completed: !!inclusion.discapacidad },
    { name: 'Experiencia laboral', completed: trabajo.length > 0 },
    { name: 'Educación superior', completed: educacion_sup.length > 0 },
    { name: 'Idiomas', completed: idiomas.length > 0 },
    { name: 'Habilidades', completed: habilidades.length > 0 },
  ];

  const optionalSections = [
    { name: 'Educación básica y media', completed: educacion_basica.length > 0 },
    { name: 'Información adicional', completed: false },
  ];

  // Handler para cambiar foto
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona una imagen en formato JPG, JPEG o PNG');
      return;
    }

    // Validar tamaño (2MB máx)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar 2MB');
      return;
    }

    setUploadingPhoto(true);
    try {
      const result = await onUploadPhoto(file);
      if (result.success) {
        alert('Foto actualizada exitosamente');
      } else {
        alert(result.message || 'Error al subir la foto');
      }
    } catch (error) {
      console.error('Error al subir foto:', error);
      alert('Error al subir la foto');
    } finally {
      setUploadingPhoto(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadCV = async () => {
    try {
      const result = await onDownloadCV();
      if (!result.success) {
        alert(result.message || 'Error al descargar el CV');
      }
    } catch (error) {
      console.error('Error al descargar CV:', error);
      alert('Error al descargar el CV');
    }
  };

  const handleSavePreferencias = async (newPreferencias) => {
    try {
      const result = await onUpdatePreferencias(newPreferencias);
      if (result.success) {
        setShowPreferencesModal(false);
        alert('Preferencias actualizadas exitosamente');
      } else {
        alert(result.message || 'Error al actualizar preferencias');
      }
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      alert('Error al actualizar preferencias');
    }
  };

  // Determinar color de la barra según el porcentaje
  const getProgressColor = () => {
    if (completeness >= 80) return 'from-green-500 to-green-600';
    if (completeness >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 sticky top-24">
        {/* Foto de Perfil */}
        <div className="text-center mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Foto de Perfil</h3>
          
          {/* Contenedor de la foto con overlay */}
          <div className="relative w-32 h-32 mx-auto mb-4 group">
            {photoUrl ? (
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${photoUrl}`}
                alt="Foto de perfil"
                className="w-full h-full rounded-full object-cover border-4 border-[#07767c]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-full flex items-center justify-center text-white text-5xl font-bold">
                {personal.nombres?.charAt(0) || 'U'}
              </div>
            )}
            
            {/* Overlay con botón de cambiar */}
            <button
              onClick={handlePhotoClick}
              disabled={uploadingPhoto}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              {uploadingPhoto ? (
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
              ) : (
                <Camera className="text-white" size={32} />
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handlePhotoClick}
            disabled={uploadingPhoto}
            className="text-sm text-[#07767c] hover:text-[#05595d] font-semibold flex items-center gap-2 mx-auto mb-4 disabled:opacity-50"
          >
            <Edit size={16} />
            {uploadingPhoto ? 'Subiendo...' : 'Cambiar foto'}
          </button>
          
          {/* Barra de Progreso */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-gray-900">{completeness}%</span>
              <span className="text-xs text-gray-600">Completitud</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`bg-gradient-to-r ${getProgressColor()} h-full transition-all duration-500`}
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Este porcentaje es solo una referencia. Te recomendamos completar tu perfil lo mejor posible.
            </p>
          </div>

          {/* Botones de CV */}
          <div className="space-y-3">
            {/* Descargar CV */}
            {freelancer.cv_url && (
              <button 
                onClick={handleDownloadCV}
                className="w-full bg-[#07767c] hover:bg-[#05595d] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Descargar CV Busquidy
              </button>
            )}

            {/* Cambiar CV */}
            <button 
              onClick={onChangeCV}
              className="w-full bg-white border-2 border-gray-300 hover:border-[#07767c] text-gray-700 hover:text-[#07767c] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {freelancer.cv_url ? 'Cambiar CV' : 'Subir CV'}
            </button>
          </div>
        </div>

        {/* Curriculum Sections */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-bold text-gray-900 mb-3">Currículum</h3>
          <div className="space-y-2">
            {sections.map((section, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className={section.completed ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {section.name}
                </span>
                {section.completed ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Secciones Opcionales */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-bold text-gray-900 mb-3">Opcionales</h3>
          <div className="space-y-2">
            {optionalSections.map((section, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className={section.completed ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {section.name}
                </span>
                {section.completed ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preferencias */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-bold text-gray-900 mb-3">Estoy interesado/a en</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className={preferencias?.ofertas_empleo ? 'text-green-600 font-medium' : 'text-gray-400'}>
                Ofertas de empleo
              </span>
              {preferencias?.ofertas_empleo ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <XCircle size={16} className="text-gray-300" />
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={preferencias?.practicas ? 'text-green-600 font-medium' : 'text-gray-400'}>
                Prácticas
              </span>
              {preferencias?.practicas ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <XCircle size={16} className="text-gray-300" />
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={preferencias?.trabajo_estudiantes ? 'text-green-600 font-medium' : 'text-gray-400'}>
                Trabajo para estudiantes
              </span>
              {preferencias?.trabajo_estudiantes ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <XCircle size={16} className="text-gray-300" />
              )}
            </div>
          </div>
          <button 
            onClick={() => setShowPreferencesModal(true)}
            className="w-full mt-4 bg-[#07767c] hover:bg-[#05595d] text-white font-semibold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Settings size={16} />
            Modificar preferencias
          </button>
        </div>
      </div>

      {/* Modal de Preferencias */}
      {showPreferencesModal && (
        <ModalPreferencias
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          currentPreferencias={preferencias}
          onSave={handleSavePreferencias}
        />
      )}
    </div>
  );
}

export default ProfileSidebar;