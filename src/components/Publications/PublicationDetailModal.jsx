import React, { useState, useEffect, useRef } from 'react';
import { FaLocationArrow, FaClock, FaMoneyBillAlt, FaStar, FaTimes, FaCheckCircle, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { BiShareAlt, BiFlag } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';

function PublicationDetailModal({ publication, isApplied, onClose, onApply, id_publicacion, id_usuario, userType }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const modalRef = useRef(null);
  const menuRef = useRef(null);

  const empresaNombre = publication.empresa || 'Empresa no especificada';
  const empresaInicial = empresaNombre.charAt(0).toUpperCase();

  // Datos de reseñas mock (no funcionales)
  const reviewsData = {
    rating: publication.rating || 3.91,
    totalReviews: 110,
    distribution: [
      { stars: 5, percentage: 51 },
      { stars: 4, percentage: 21 },
      { stars: 3, percentage: 13 },
      { stars: 2, percentage: 6 },
      { stars: 1, percentage: 9 }
    ],
    categories: [
      { name: 'Ambiente de trabajo', score: 4.0 },
      { name: 'Salario y prestaciones', score: 3.35 },
      { name: 'Oportunidades de carrera', score: 3.03 },
      { name: 'Director general', score: 3.21 }
    ],
    recommendation: 78
  };

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
        {/* Modal Content */}
        <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-[modalSlideIn_0.3s_ease-out]">
          
          {/* Header limpio y espacioso */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{empresaInicial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-0.5">Publicado por</p>
                <p className="font-bold text-gray-900 truncate">{empresaNombre}</p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
                <FaStar className="text-yellow-500 text-sm" />
                <span className="font-semibold text-gray-900 text-sm">{reviewsData.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {/* Menú de opciones */}
              <div className="relative" ref={menuRef}>
                <button 
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <BsThreeDotsVertical className="text-lg" />
                </button>

                {showOptions && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 min-w-[160px]">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      onClick={() => {
                        setIsSaved(!isSaved);
                        setShowOptions(false);
                      }}
                    >
                      {isSaved ? <FaBookmark className="text-[#07767c]" /> : <FaRegBookmark />}
                      {isSaved ? 'Guardado' : 'Guardar'}
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      onClick={() => {
                        console.log('Compartir');
                        setShowOptions(false);
                      }}
                    >
                      <BiShareAlt />
                      Compartir
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      onClick={() => {
                        console.log('Denunciar');
                        setShowOptions(false);
                      }}
                    >
                      <BiFlag />
                      Denunciar
                    </button>
                  </div>
                )}
              </div>

              <button 
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded-lg transition-all duration-200 hover:rotate-90"
                onClick={onClose}
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Badge de estado aplicado */}
          {isApplied && (
            <div className="px-6 pt-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                <FaCheckCircle />
                <span>Ya aplicaste a este proyecto</span>
              </div>
            </div>
          )}

          {/* Título */}
          <div className="px-6 pt-4 pb-6">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-6">
              {publication.titulo || 'Título no disponible'}
            </h2>

            {/* Info cards horizontales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <FaLocationArrow className="text-blue-600 text-sm" />
                  <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">Ubicación</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{publication.ubicacion || 'No especificada'}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-purple-600 text-sm" />
                  <span className="text-xs font-semibold text-purple-900 uppercase tracking-wide">Duración</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{publication.duracion_estimada || 'No especificada'}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <FaMoneyBillAlt className="text-green-600 text-sm" />
                  <span className="text-xs font-semibold text-green-900 uppercase tracking-wide">Presupuesto</span>
                </div>
                <p className="text-sm font-bold text-green-700">{publication.presupuesto || 'A convenir'}</p>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="px-6 pb-6 space-y-6">
            
            {/* Descripción */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Descripción del Proyecto</h3>
              <p className="text-gray-700 leading-relaxed">
                {publication.descripcion || 'No se proporcionó descripción para este proyecto.'}
              </p>
            </div>

            {/* Habilidades */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Habilidades Requeridas</h3>
              {publication.habilidades ? (
                <div className="flex flex-wrap gap-2">
                  {publication.habilidades.split(',').map((skill, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-[#07767c]/10 to-[#40E0D0]/10 text-[#07767c] rounded-lg text-sm font-semibold border border-[#07767c]/20 hover:border-[#07767c]/40 transition-colors"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No se especificaron habilidades requeridas.</p>
              )}
            </div>

            {/* Sección de Reseñas de la Empresa */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reseñas de {empresaNombre}</h3>
              
              {/* Rating general */}
              <div className="flex items-start gap-6 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{reviewsData.rating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(reviewsData.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{reviewsData.totalReviews} Evaluaciones</p>
                </div>

                {/* Distribución de estrellas */}
                <div className="flex-1 space-y-2">
                  {reviewsData.distribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-gray-600">{item.stars}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.stars === 5 ? 'bg-green-500' : 
                            item.stars === 4 ? 'bg-lime-500' : 
                            item.stars === 3 ? 'bg-yellow-400' : 
                            item.stars === 2 ? 'bg-orange-400' : 
                            'bg-red-400'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-right text-gray-600">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorías de evaluación */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {reviewsData.categories.map((category, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-[#07767c] mb-1">{category.score}</div>
                    <p className="text-xs text-gray-600">{category.name}</p>
                  </div>
                ))}
              </div>

              {/* Recomendación */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                <p className="text-center">
                  <span className="text-2xl font-bold text-orange-600">{reviewsData.recommendation}%</span>
                  <span className="text-sm text-gray-700 ml-2">profesionales recomiendan trabajar aquí</span>
                </p>
              </div>
            </div>

            {/* Consejos */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-lg">
                  💡
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Consejos para tu postulación</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Revisa cuidadosamente los requisitos</li>
                    <li>• Destaca tu experiencia relevante</li>
                    <li>• Sé claro sobre tu disponibilidad</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <button
              className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${
                isApplied 
                  ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
                  : 'bg-gradient-to-r from-[#059669] to-[#10b981] text-white hover:shadow-lg hover:from-[#047857] hover:to-[#059669]'
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
                <span className="flex items-center justify-center gap-2">
                  <FaCheckCircle />
                  Ya aplicaste a este proyecto
                </span>
              ) : (
                'Postularme al Proyecto'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PublicationDetailModal;