import React, { useState } from 'react';
import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar, FaTimes, FaBuilding, FaUserTie, FaCheckCircle } from 'react-icons/fa';
import { BsBookmarkPlus, BsFillBookmarkFill } from 'react-icons/bs';
import { BiShareAlt } from 'react-icons/bi';
import CompanyReviewModal from './CompanyReviewModal';

function PublicationDetailModal({ publication, isApplied, onClose, onApply, id_publicacion, id_usuario, userType }) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const empresaNombre = publication.empresa || 'Empresa no especificada';
  const empresaInicial = empresaNombre.charAt(0).toUpperCase();

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
        {/* Modal Content */}
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-[modalSlideIn_0.3s_ease-out]">
          
          {/* Header mejorado */}
          <div className="relative bg-gradient-to-br from-[#07767c] via-[#05595d] to-[#043d42] px-8 pt-8 pb-20 rounded-t-3xl">
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 z-10 w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all duration-200 hover:rotate-90"
              onClick={onClose}
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Action buttons en header */}
            <div className="absolute top-6 right-20 z-10 flex gap-2">
              <button 
                className="w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all duration-200 hover:scale-110"
                onClick={() => setIsSaved(!isSaved)}
              >
                {isSaved ? <BsFillBookmarkFill className="text-lg" /> : <BsBookmarkPlus className="text-lg" />}
              </button>
              <button 
                className="w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all duration-200 hover:scale-110"
              >
                <BiShareAlt className="text-lg" />
              </button>
            </div>

            {/* Badge de estado */}
            {isApplied && (
              <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
                <FaCheckCircle />
                <span>Ya aplicaste a este proyecto</span>
              </div>
            )}

            {/* Título */}
            <h2 className="text-4xl font-bold text-white mb-6 pr-24 leading-tight">
              {publication.titulo || 'Título no disponible'}
            </h2>

            {/* Empresa info en header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-white/30">
                <span className="text-white font-bold text-2xl">{empresaInicial}</span>
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-1">Publicado por</p>
                <p className="text-white font-bold text-xl">{empresaNombre}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-300 text-sm" />
                    <span className="text-white font-semibold text-sm">{publication.rating || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta elevada con info clave */}
          <div className="px-8 -mt-12 relative z-10">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                    <FaLocationArrow className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Ubicación</p>
                    <p className="text-base font-bold text-gray-900 truncate">{publication.ubicacion || 'No especificada'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                    <FaClock className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Duración</p>
                    <p className="text-base font-bold text-gray-900 truncate">{publication.duracion_estimada || 'No especificada'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                    <FaMoneyBillAlt className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Presupuesto</p>
                    <p className="text-base font-bold text-green-600 truncate">{publication.presupuesto || 'A convenir'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido del modal */}
          <div className="px-8 py-8">
            
            {/* Description Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-8 bg-gradient-to-b from-[#07767c] to-[#40E0D0] rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900 m-0">Descripción del Proyecto</h3>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed text-base">
                  {publication.descripcion || 'No se proporcionó descripción para este proyecto.'}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-8 bg-gradient-to-b from-[#07767c] to-[#40E0D0] rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900 m-0">Habilidades Requeridas</h3>
              </div>
              {publication.habilidades ? (
                <div className="flex flex-wrap gap-3">
                  {publication.habilidades.split(',').map((skill, index) => (
                    <span 
                      key={index}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#07767c]/10 to-[#40E0D0]/10 text-[#07767c] rounded-xl text-sm font-bold border-2 border-[#07767c]/20 hover:border-[#07767c]/40 transition-all duration-200 hover:shadow-md"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <p className="text-gray-500 italic text-center">No se especificaron habilidades requeridas.</p>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Consejos para aplicar</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Revisa cuidadosamente los requisitos del proyecto</li>
                    <li>• Asegúrate de tener las habilidades necesarias</li>
                    <li>• Prepara un portafolio relevante</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t-2 border-gray-100">
              <button
                className={`w-full py-5 rounded-xl border-none cursor-pointer font-bold text-lg transition-all duration-300 shadow-lg ${
                  isApplied 
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500' 
                    : 'bg-gradient-to-r from-[#07767c] to-[#05595d] text-white hover:from-[#05595d] hover:to-[#043d42] hover:shadow-xl hover:-translate-y-1'
                }`}
                disabled={isApplied}
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!isApplied) {
                    await onApply(id_publicacion);
                  }
                }}
              >
                {isApplied ? (
                  <span className="flex items-center justify-center gap-3">
                    <FaCheckCircle />
                    Ya aplicaste a este proyecto
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <FaUserTie />
                    Postularme al Proyecto
                  </span>
                )}
              </button>

              {!isApplied && (
                <button 
                  className="w-full py-4 bg-white border-2 border-[#07767c] text-[#07767c] rounded-xl cursor-pointer font-bold text-base hover:bg-[#07767c] hover:text-white transition-all duration-300 hover:shadow-lg"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaStar />
                    Dejar Reseña a la Empresa
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Company Review Modal */}
        <CompanyReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onReviewButtonClick={() => setIsReviewModalOpen(true)}
          id_identificador={id_publicacion}
          id_usuario={id_usuario}
          userType={userType}
        />
      </div>
    </>
  );
}

export default PublicationDetailModal;