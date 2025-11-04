import React, { useState, useEffect, useRef } from 'react';
import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar, FaBookmark, FaRegBookmark, FaUserTie } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiHide, BiFlag } from 'react-icons/bi';
import PublicationDetailModal from './PublicationDetailModal';
import { checkUserApplication } from '@/api/publicationsApi';

function PublicationCard({ publication, isApplied: isAppliedProp, onApply, id_usuario, userType }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isApplied, setIsApplied] = useState(isAppliedProp);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const menuRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    setShowOptions(false);
  };

  const handleHide = (e) => {
    e.stopPropagation();
    console.log('Ocultar publicación');
    setShowOptions(false);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    console.log('Denunciar publicación');
    setShowOptions(false);
  };

  const handleApply = async (e) => {
    e.stopPropagation();
    if (!isApplied) {
      const result = await onApply(publication.id_publicacion);
      if (result.success) {
        setIsApplied(true);
      }
    }
    setShowOptions(false);
  };

  // Verificar estado de postulación al montar el componente
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!id_usuario || userType !== 'freelancer') {
        return;
      }

      try {
        setCheckingApplication(true);
        const { hasApplied } = await checkUserApplication(publication.id_publicacion);
        setIsApplied(hasApplied);
      } catch (error) {
        console.error('Error al verificar estado de postulación:', error);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplicationStatus();
  }, [publication.id_publicacion, id_usuario, userType]);

  // Calcular tiempo desde publicación
  const getTimeAgo = () => {
    if (!publication.fecha_publicacion) return 'Hace un momento';
    
    const now = new Date();
    const pubDate = new Date(publication.fecha_publicacion);
    const diffMs = now - pubDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 30) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    return 'Hace más de un mes';
  };

  const empresaNombre = publication.empresa || 'Empresa no especificada';
  const empresaInicial = empresaNombre.charAt(0).toUpperCase();
  const isRecommended = publication.recomendada || false;

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 h-auto flex flex-col group relative ${
          isApplied 
            ? 'opacity-70 cursor-default' 
            : 'hover:shadow-lg hover:border-[#40E0D0]/40 hover:-translate-y-1'
        }`}
        onClick={!isApplied ? openModal : undefined}
      >
        {/* Badges superiores */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            {isRecommended && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md inline-block">
                ⭐ Publicación Recomendada
              </span>
            )}
            {isApplied && !checkingApplication && (
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md inline-block">
                ✓ Aplicado
              </span>
            )}
          </div>
        </div>
        
        {/* Header con título y opciones */}
        <div className="px-5 pt-5 pb-3" style={{ marginTop: isRecommended || isApplied ? '2.5rem' : '0' }}>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-900 leading-snug pr-8 group-hover:text-[#07767c] transition-colors line-clamp-2">
              {publication.titulo || 'Título no disponible'}
              {publication.tipo === 'tarea' ? (
                <span className="ml-2 px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-300">
                  Tarea
                </span>
              ) : (
                <span className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-300">
                  Proyecto
                </span>
              )}
            </h3>
            <div className="relative" ref={menuRef}>
              <button 
                className="flex-shrink-0 text-gray-400 hover:text-[#07767c] transition-colors p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(!showOptions);
                }}
              >
                <BsThreeDotsVertical className="text-xl" />
              </button>

              {/* Menú desplegable */}
              {showOptions && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 min-w-[180px]">
                  {!isApplied && !checkingApplication && (
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors font-semibold"
                      onClick={handleApply}
                    >
                      <FaUserTie className="text-[#07767c]" />
                      Postularme
                    </button>
                  )}
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    onClick={toggleSave}
                  >
                    {isSaved ? <FaBookmark className="text-[#07767c]" /> : <FaRegBookmark />}
                    {isSaved ? 'Guardado' : 'Guardar'}
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    onClick={handleHide}
                  >
                    <BiHide />
                    Ocultar publicación
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    onClick={handleReport}
                  >
                    <BiFlag />
                    Denunciar
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Empresa con badge verificado */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{empresaInicial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{empresaNombre}</p>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 text-xs" />
                <span className="text-xs text-gray-600 font-medium">{publication.rating || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Tiempo desde publicación */}
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FaClock className="text-gray-400" />
            {getTimeAgo()}
          </p>
        </div>

        {/* Info Grid compacta */}
        <div className="px-5 py-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <FaLocationArrow className="text-blue-500 text-xs flex-shrink-0" />
            <span className="text-gray-600 truncate">{publication.ubicacion || 'No especificada'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaClock className="text-purple-500 text-xs flex-shrink-0" />
            <span className="text-gray-600 truncate">{publication.duracion_estimada || 'No especificada'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaMoneyBillAlt className="text-green-500 text-xs flex-shrink-0" />
            <span className="font-semibold text-green-600 truncate">{publication.presupuesto || 'A convenir'}</span>
          </div>
        </div>

        {/* Espaciador para mantener altura */}
        <div className="flex-grow"></div>
      </div>

      {isModalOpen && (
        <PublicationDetailModal
          publication={publication}
          isApplied={isApplied}
          onClose={closeModal}
          onApply={onApply}
          id_publicacion={publication.id_publicacion}
          id_usuario={id_usuario}
          userType={userType}
        />
      )}
    </>
  );
}

export default PublicationCard;