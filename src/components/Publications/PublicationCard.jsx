import React, { useState } from 'react';
import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import PublicationDetailModal from './PublicationDetailModal';

function PublicationCard({ publication, isApplied, onApply, id_usuario, userType }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  // Validación y valor por defecto para empresa
  const empresaNombre = publication.empresa || 'Empresa no especificada';
  const empresaInicial = empresaNombre.charAt(0).toUpperCase();

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 h-auto flex flex-col group relative ${
          isApplied 
            ? 'opacity-70 cursor-default' 
            : 'hover:shadow-xl hover:border-[#07767c]/30 hover:-translate-y-1'
        }`}
        onClick={!isApplied ? openModal : undefined}
      >
        {/* Badge de estado "Destacado" o "Aplicado" */}
        {isApplied && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md">
              ✓ Aplicado
            </span>
          </div>
        )}
        
        {/* Header con título y opciones */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 leading-tight pr-8 group-hover:text-[#07767c] transition-colors line-clamp-2">
              {publication.titulo || 'Título no disponible'}
            </h3>
            <button 
              className="flex-shrink-0 text-gray-400 hover:text-[#07767c] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <BsThreeDotsVertical className="text-xl" />
            </button>
          </div>
          
          {/* Empresa con badge verificado */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{empresaInicial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{empresaNombre}</p>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-500 text-xs" />
                <span className="text-sm text-gray-600 font-medium">{publication.rating || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-6"></div>

        {/* Info Grid mejorada */}
        <div className="px-6 py-5 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaLocationArrow className="text-blue-600 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Ubicación</p>
              <p className="font-medium truncate">{publication.ubicacion || 'No especificada'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaClock className="text-purple-600 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Duración</p>
              <p className="font-medium truncate">{publication.duracion_estimada || 'No especificada'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaMoneyBillAlt className="text-green-600 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Presupuesto</p>
              <p className="font-bold text-green-600 truncate">{publication.presupuesto || 'A convenir'}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-6"></div>

        {/* Footer con acciones */}
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 mr-3 ${
              isApplied
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#07767c] to-[#05595d] text-white hover:shadow-md'
            }`}
            disabled={isApplied}
            onClick={async (e) => {
              e.stopPropagation();
              if (!isApplied) {
                await onApply(publication.id_publicacion);
              }
            }}
          >
            {isApplied ? 'Ya aplicaste' : 'Postular'}
          </button>
          
          <button 
            className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isSaved 
                ? 'bg-[#07767c] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={toggleSave}
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
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