import React, { useState, useEffect } from 'react';
import PublicationCard from './PublicationCard';
import MessageModal from '../MessageModal';
import { getPublications, getFreelancerApplications, createApplication } from '../../api/publicationsApi';

function PublicationList({ userType, id_usuario, filters }) {
    const [publications, setPublications] = useState([]);
    const [filteredPublications, setFilteredPublications] = useState([]);
    const [appliedPublications, setAppliedPublications] = useState([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
   
    useEffect(() => {
        const fetchAppliedPublications = async () => {
            if (userType === 'freelancer' && id_usuario) {
                try {
                    const data = await getFreelancerApplications(id_usuario);
                    setAppliedPublications(data.map(app => app.id_publicacion));
                } catch (error) {
                    console.error('Error fetching applied publications:', error);
                }
            }
        };
        fetchAppliedPublications();
    }, [userType, id_usuario]);

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const data = await getPublications();
                const activePublications = data.filter(pub => pub.estado_publicacion === 'activo');
                setPublications(activePublications);
            } catch (error) {
                console.error('Error fetching publications:', error);
            }
        };
        fetchPublications();
    }, []);

    useEffect(() => {
        let result = publications;

        if (filters.searchText) {
            result = result.filter(pub => 
                pub.titulo.toLowerCase().includes(filters.searchText.toLowerCase())
            );
        }

        if (filters.sortBy === 'fecha') {
            result = result.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
        } else if (filters.sortBy === 'salario') {
            result = result.sort((a, b) => b.presupuesto - a.presupuesto);
        }

        const today = new Date();
        if (filters.date === 'hoy') {
            result = result.filter(pub => {
                const pubDate = new Date(pub.fecha_publicacion);
                return pubDate.toDateString() === today.toDateString();
            });
        } else if (filters.date === 'semana') {
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(today.getDate() - 7);
            result = result.filter(pub => {
                const pubDate = new Date(pub.fecha_publicacion);
                return pubDate >= oneWeekAgo;
            });
        } else if (filters.date === 'mes') {
            const oneMonthAgo = new Date(today);
            oneMonthAgo.setMonth(today.getMonth() - 1);
            result = result.filter(pub => {
                const pubDate = new Date(pub.fecha_publicacion);
                return pubDate >= oneMonthAgo;
            });
        }

        setFilteredPublications(result);
    }, [publications, filters]);

    const postulacion = async (id_publicacion) => {
        try {
            if (userType !== 'freelancer') {
                setMessage('Solo los freelancers pueden postular a publicaciones.');
                setShowMessageModal(true);
                return { success: false, message }
            }

            await createApplication(id_publicacion, id_usuario);
            
            setMessage('Postulación enviada exitosamente.');
            setShowMessageModal(true);
            setAppliedPublications([...appliedPublications, id_publicacion]);
            return { success: true }
        } catch (error) {
            console.error('Error applying to publication:', error);
            setMessage('Error al enviar la postulación.');
            setShowMessageModal(true);
            return { success: false };
        }
    };

    const handleCloseModal = () => {
        setShowMessageModal(false);
        setMessage('');
    };

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
                                    isApplied={appliedPublications.includes(publication.id_publicacion)}
                                    onApply={postulacion}
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

                {showMessageModal && (
                    <MessageModal 
                        message={message} 
                        closeModal={handleCloseModal} 
                    />
                )}
            </div>
        </div>
    );
}

export default PublicationList;