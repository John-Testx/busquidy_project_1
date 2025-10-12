// import React, { useState } from 'react';
// import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar } from 'react-icons/fa';
// import { BsBookmarkPlus } from 'react-icons/bs';
// import PublicationDetailModal from './PublicationDetailModal';
// import '../../styles/Freelancer/PublicationCard.css';
import React, { useState } from 'react'; 
import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar } from 'react-icons/fa';
import { BsBookmarkPlus } from 'react-icons/bs';
import PublicationDetailModal from './PublicationDetailModal';
// import '../../styles/Freelancer/PublicationCard.css'; 

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
        className={`bg-white rounded-2xl shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-transparent h-64 flex flex-col hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-blue-500 ${
          isApplied ? 'opacity-70 cursor-default' : ''
        }`}
        onClick={openModal}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3.5 bg-gray-50 border-b border-gray-200">
          <h3 className="m-0 text-lg text-gray-800 font-semibold">
            {publication.titulo}
          </h3>
          <button className="bg-transparent border-none text-blue-500 text-xl cursor-pointer transition-colors duration-200 hover:text-blue-700">
            <BsBookmarkPlus />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2.5 px-4 py-3.5 text-gray-600 flex-grow">
          <p className="flex items-center gap-2 m-0 text-sm">
            <FaLocationArrow /> {publication.ubicacion}
          </p>
          <p className="flex items-center gap-2 m-0 text-sm">
            <FaClock /> {publication.duracion_estimada}
          </p>
          <p className="flex items-center gap-2 m-0 text-sm">
            <FaMoneyBillAlt /> {publication.presupuesto}
          </p>
          <p className="flex items-center gap-2 m-0 text-sm">
            <FaStar /> {publication.rating} ⭐
          </p>
        </div>

        {/* Company Footer */}
        <div className="bg-gray-100 px-4 py-2.5 text-right text-gray-700 text-sm">
          <p className="m-0">{publication.empresa}</p>
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