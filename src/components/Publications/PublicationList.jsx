import React from 'react';
import PublicationCard from './PublicationCard';
import MessageModal from '@/components/MessageModal';
import { usePublications } from '@/hooks';

function PublicationList({ userType, id_usuario, filters }) {
  const {
    filteredPublications,
    loading,
    modalMessage,
    isPublicationApplied,
    applyToPublication,
    closeModal
  } = usePublications(userType, id_usuario, filters);

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[500px]">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-[#07767c]/20 border-t-[#07767c] rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-700 font-semibold text-lg">Cargando oportunidades...</p>
            <p className="text-gray-500 text-sm mt-2">Estamos buscando los mejores proyectos para ti</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {filteredPublications.length > 0 ? (
          <>
            {/* Contador de resultados mejorado */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-gradient-to-b from-[#07767c] to-[#40E0D0] rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Proyectos Disponibles</h2>
              </div>
              <p className="text-gray-600 ml-5">
                <span className="text-[#07767c] font-bold text-lg">{filteredPublications.length}</span> {filteredPublications.length === 1 ? 'proyecto encontrado' : 'proyectos encontrados'}
              </p>
            </div>

            {/* Grid de publicaciones con mejor espaciado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredPublications.map(publication => (
                <PublicationCard 
                  key={publication.id_publicacion}
                  publication={publication}
                  isApplied={isPublicationApplied(publication.id_publicacion)}
                  onApply={applyToPublication}
                  id_usuario={id_usuario}
                  userType={userType}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <i className="bi bi-briefcase text-6xl text-gray-400"></i>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">No hay proyectos disponibles</h3>
            <p className="text-gray-500 text-center max-w-md text-lg mb-6">
              No se encontraron proyectos que coincidan con tus filtros actuales
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Reintentar búsqueda
            </button>
          </div>
        )}

        {modalMessage.show && (
          <MessageModal 
            message={modalMessage.message} 
            closeModal={closeModal} 
          />
        )}
      </div>
    </div>
  );
}

export default PublicationList;