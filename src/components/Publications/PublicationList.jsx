import React from 'react';
import PublicationCard from './PublicationCard';
import MessageModal from '@/components/MessageModal';
import usePublications from '@/hooks/usePublications';

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
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#07767c]/20 border-t-[#07767c] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando publicaciones...</p>
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
            {/* Contador de resultados */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 font-medium">
                Se encontraron <span className="text-[#07767c] font-bold">{filteredPublications.length}</span> publicaciones
              </p>
            </div>

            {/* Grid de publicaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <i className="bi bi-search text-5xl text-gray-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No se encontraron publicaciones</h3>
            <p className="text-gray-500 text-center max-w-md">
              Intenta ajustar los filtros de búsqueda o busca con otros términos
            </p>
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