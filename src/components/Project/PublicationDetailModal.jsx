import React, {useState} from 'react';
import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar, FaTimes } from 'react-icons/fa';
import { BsBookmarkPlus } from 'react-icons/bs';
import CompanyReviewModal from './CompanyReviewModal';

function PublicationDetailModal({ publication, isApplied, onClose, onApply, id_publicacion, id_usuario, userType }) {

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <>
      {/* Modal Overlay - SIN animación */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
        {/* Modal Content - CON animación */}
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-[modalSlideIn_0.3s_ease-out]">
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
            onClick={onClose}
          >
            <FaTimes className="text-lg" />
          </button>
          
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#07767c] to-[#05595d] px-8 pt-8 pb-6 rounded-t-2xl">
            <h2 className="text-3xl font-bold text-white m-0 pr-12">{publication.titulo}</h2>
          </div>
          
          {/* Contenido del modal */}
          <div className="px-8 py-6">
            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaLocationArrow className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Ubicación</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{publication.ubicacion}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Duración</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{publication.duracion_estimada}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMoneyBillAlt className="text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Presupuesto</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{publication.presupuesto}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaStar className="text-yellow-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Calificación</p>
                  <p className="text-sm font-semibold text-gray-800">{publication.rating} ⭐</p>
                </div>
              </div>
            </div>
            
            {/* Description Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#07767c] to-[#40E0D0] rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-800 m-0">Descripción del Proyecto</h3>
              </div>
              <p className="text-gray-700 leading-relaxed pl-4">{publication.descripcion}</p>
            </div>
            
            {/* Company Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#07767c] to-[#40E0D0] rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-800 m-0">Empresa</h3>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl ml-4">
                <p className="text-gray-800 font-semibold text-lg m-0">{publication.empresa}</p>
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#07767c] to-[#40E0D0] rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-800 m-0">Habilidades Requeridas</h3>
              </div>
              {publication.habilidades ? (
                <div className="flex flex-wrap gap-2 pl-4">
                  {publication.habilidades.split(',').map((skill, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-[#07767c]/10 text-[#07767c] rounded-lg text-sm font-medium border border-[#07767c]/20"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic pl-4">No se especificaron habilidades requeridas.</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t-2 border-gray-100">
              <button
                className={`w-full py-4 rounded-xl border-none cursor-pointer font-bold text-base transition-all duration-300 ${
                  isApplied 
                    ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:-translate-y-0.5'
                }`}
                disabled={isApplied}
                onClick={async () => {
                  const result = await onApply(id_publicacion);
                }}
              >
                {isApplied ? '✓ Ya Aplicaste' : 'Postularme al Proyecto'}
              </button>

              <button 
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl border-none cursor-pointer font-bold text-base hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => setIsReviewModalOpen(true)}
              >
                ⭐ Dejar Reseña a la Empresa
              </button>
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