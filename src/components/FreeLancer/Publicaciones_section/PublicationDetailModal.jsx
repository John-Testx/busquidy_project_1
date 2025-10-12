// import React, {useState} from 'react';
// import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar,   FaTimes } from 'react-icons/fa';
// import '../../../styles/Freelancer/PublicationDetailModal.css';
// import { BsBookmarkPlus } from 'react-icons/bs';
// import CompanyReviewModal from './CompanyReviewModal'

import React, {useState} from 'react';
import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar,   FaTimes } from 'react-icons/fa';
// import '../../styles/Freelancer/PublicationDetailModal.css';
import { BsBookmarkPlus } from 'react-icons/bs';
import CompanyReviewModal from './CompanyReviewModal'

function PublicationDetailModal({ publication, isApplied, onClose, onApply, id_publicacion, id_usuario, userType }) {

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-[1000]">
        {/* Modal Content */}
        <div className="bg-white rounded-xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto p-5 relative">
          {/* Close Button */}
          <button 
            className="absolute top-2.5 right-2.5 bg-transparent border-none text-2xl cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
            onClick={onClose}
          >
            <FaTimes />
          </button>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-gray-800 m-0">{publication.titulo}</h2>
          </div>
          
          {/* Meta Info */}
          <div className="flex justify-between flex-wrap gap-3 mb-5 text-gray-600">
            <div className="flex items-center gap-1.5">
              <FaLocationArrow className="text-blue-500" />
              <span>{publication.ubicacion}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaClock className="text-blue-500" />
              <span>{publication.duracion_estimada}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaMoneyBillAlt className="text-green-500" />
              <span>{publication.presupuesto}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaStar className="text-yellow-500" />
              <span>{publication.rating} ⭐</span>
            </div>
          </div>
          
          {/* Description Section */}
          <div className="mb-5">
            <h3 className="border-b-2 border-gray-200 pb-2.5 mb-2.5 text-lg font-semibold text-gray-800">
              Descripción del Proyecto
            </h3>
            <p className="text-gray-700 leading-relaxed">{publication.descripcion}</p>
          </div>
          
          {/* Company Section */}
          <div className="mb-5">
            <h3 className="border-b-2 border-gray-200 pb-2.5 mb-2.5 text-lg font-semibold text-gray-800">
              Empresa
            </h3>
            <p className="text-gray-700">{publication.empresa}</p>
          </div>
          
          {/* Skills Section */}
          <div className="mb-5">
            <h3 className="border-b-2 border-gray-200 pb-2.5 mb-2.5 text-lg font-semibold text-gray-800">
              Habilidades Requeridas
            </h3>
            {publication.habilidades ? (
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {publication.habilidades.split(',').map((skill, index) => (
                  <li key={index}>{skill.trim()}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No se especificaron habilidades requeridas.</p>
            )}
          </div>
          
          {/* Apply Button */}
          <button
            className={`w-full py-2.5 rounded-lg border-none cursor-pointer mb-2.5 font-semibold transition-all ${
              isApplied 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            disabled={isApplied}
            onClick={async () => {
              const result = await onApply(id_publicacion);
            }}
          >
            {isApplied ? 'Ya Aplicaste' : 'Postularme'}
          </button>

          {/* Review Button */}
          <button 
            className="w-full py-2.5 bg-blue-500 text-white rounded-lg border-none cursor-pointer font-semibold hover:bg-blue-600 transition-all"
            onClick={() => setIsReviewModalOpen(true)}
          >
            Dejar Reseña
          </button>
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