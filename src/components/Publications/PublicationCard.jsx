import React, { useState } from 'react';
import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar } from 'react-icons/fa';
import { BsBookmarkPlus } from 'react-icons/bs';
import PublicationDetailModal from './PublicationDetailModal';

function PublicationCard({ publication, isApplied, onApply, id_usuario, userType }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-md transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent h-72 flex flex-col group ${
          isApplied 
            ? 'opacity-60 cursor-default border-gray-300' 
            : 'hover:shadow-2xl hover:border-[#07767c] hover:-translate-y-2'
        }`}
        onClick={!isApplied ? openModal : undefined}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
          <h3 className="m-0 text-lg text-gray-800 font-bold truncate pr-2 flex-1 group-hover:text-[#07767c] transition-colors">
            {publication.titulo}
          </h3>
          <button 
            className="bg-transparent border-none text-[#07767c] text-2xl cursor-pointer transition-all duration-200 hover:text-[#40E0D0] hover:scale-110 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              // Lógica para guardar
            }}
          >
            <BsBookmarkPlus />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 px-5 py-4 text-gray-600 flex-grow">
          <div className="flex items-center gap-2.5 text-sm">
            <FaLocationArrow className="text-[#07767c] text-base flex-shrink-0" />
            <span className="truncate">{publication.ubicacion}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <FaClock className="text-[#07767c] text-base flex-shrink-0" />
            <span className="truncate">{publication.duracion_estimada}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <FaMoneyBillAlt className="text-green-600 text-base flex-shrink-0" />
            <span className="truncate font-semibold">{publication.presupuesto}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <FaStar className="text-yellow-500 text-base flex-shrink-0" />
            <span className="font-semibold">{publication.rating} ⭐</span>
          </div>
        </div>

        {/* Company Footer */}
        <div className="bg-gradient-to-r from-[#07767c] to-[#05595d] px-5 py-3 flex items-center justify-between">
          <p className="m-0 text-white text-sm font-medium truncate">{publication.empresa}</p>
          {isApplied && (
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ml-2">
              Aplicado
            </span>
          )}
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