// src/pages/Video/MyCallsPage.jsx
import React, { useState, useEffect } from 'react'; // 👈 Importar useEffect
import { useNavigate } from 'react-router-dom';
import { createVideoRoom, fetchUpcomingInterviews } from '@/api/videoApi'; // 👈 Asegúrate de importar fetchUpcomingInterviews
import { Video, Plus, CalendarDays, MonitorUp, Clock, Calendar, Link } from 'lucide-react'; // 👈 Iconos extra para la lista
import MainLayout from '@/components/Layouts/MainLayout';

const MyCallsPage = () => {
    const navigate = useNavigate();
    
    // --- Estado para las Entrevistas Programadas ---
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [fetchError, setFetchError] = useState(null); 

    // --- Estado para "Crear Sala" ---
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState(null);

    // ----------------------------------------------------------------------
    // FUNCIONES DE ACCIÓN PRINCIPALES
    // ----------------------------------------------------------------------

    const handleCreateAndJoinRoom = async () => {
        setIsCreating(true);
        setCreateError(null);
        try {
            const roomData = await createVideoRoom(); 
            if (roomData && roomData.roomId) {
                navigate(`/video/${roomData.roomId}`); 
            } else {
                throw new Error('No se recibió un ID de sala válido del servidor.');
            }
        } catch (err) {
            setCreateError('Error al crear la sala. Inténtalo de nuevo más tarde.');
            console.error("Error en handleCreateAndJoinRoom:", err); 
        } finally {
            setIsCreating(false);
        }
    };

    const openJoinRoomAction = () => {
        const roomId = prompt("Introduce el ID o enlace de la sala a la que quieres unirte:");
        if (roomId) {
            navigate(`/video/${roomId.trim()}`);
        }
    };

    const handleScheduleMeeting = () => alert("Funcionalidad Programar Reunión - Se requiere implementar un formulario de agendamiento.");
    const handleShareScreen = () => alert("Funcionalidad Compartir Pantalla - Se requiere implementar la lógica de WebRTC.");

    // ----------------------------------------------------------------------
    // LÓGICA DE CARGA DE ENTREVISTAS (La clave para la lista)
    // ----------------------------------------------------------------------

    const loadInterviews = async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            // Llama a la nueva función API implementada
            const data = await fetchUpcomingInterviews(); 
            setUpcomingInterviews(data);
        } catch (err) {
            // Muestra error si la API falla o no devuelve datos
            setFetchError('No se pudieron cargar las reuniones programadas.');
            console.error("Error al cargar entrevistas:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Ejecutar la carga de datos al montar el componente
    useEffect(() => {
        loadInterviews();
    }, []); 

    // ----------------------------------------------------------------------
    // COMPONENTE DE TARJETA INDIVIDUAL (Incluye la opción de Unirse)
    // ----------------------------------------------------------------------

    const InterviewCard = ({ interview }) => {
        // La fecha debe ser un string en formato ISO para que new Date() lo entienda
        const date = new Date(interview.fecha_hora_inicio);
        const formattedDate = date.toLocaleDateString('es-ES');
        const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        return (
            <div className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-3">
                <div className="flex flex-col text-left">
                    {/* El backend debe devolver 'nombre_contraparte' */}
                    <p className="text-lg font-bold text-gray-800">Entrevista con {interview.nombre_contraparte || 'Contratista'}</p>
                    <p className="text-sm text-gray-500">{interview.titulo || 'Reunión Agendada'}</p> 
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>{formattedDate}</span>
                        <Clock size={16} className="ml-4 mr-2 text-gray-500" />
                        <span>{formattedTime}</span>
                    </div>
                </div>
                <button 
                    // 🎯 Esta es la opción de UNIRSE: navega al Room ID preexistente
                    onClick={() => navigate(`/video/${interview.room_id}`)}
                    className="flex items-center bg-[#6d9b96] hover:bg-[#5a827d] text-white font-medium py-2 px-4 rounded-full transition duration-150"
                >
                    <Link size={18} className="mr-2"/>
                    Unirse
                </button>
            </div>
        );
    };

    // ----------------------------------------------------------------------
    // RENDERIZADO PRINCIPAL
    // ----------------------------------------------------------------------

    return (
        <MainLayout>
            <div className="container mx-auto p-8 lg:px-12 min-h-[calc(100vh-64px)]">
                
                <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800 border-b pb-4">
                    Videollamadas
                </h1>

                {/* Grid para los botones de acción principales (SE MANTIENE) */}
                <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* ... (Botones de acción) ... */}
                    <button
                        onClick={handleCreateAndJoinRoom}
                        disabled={isCreating}
                        className={`
                            flex flex-col items-center justify-center p-6 rounded-xl 
                            ${isCreating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6d9b96] hover:bg-[#5a827d]'} 
                            text-white font-semibold text-lg shadow-lg transform hover:scale-[1.03] transition-all duration-200
                        `}
                    >
                        <Video size={48} className="mb-2" />
                        <span>{isCreating ? 'Creando...' : 'Nueva Reunión'}</span>
                    </button>
                    <button
                        onClick={openJoinRoomAction} 
                        className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#6d9b96] hover:bg-[#5a827d] text-white font-semibold text-lg shadow-lg transform hover:scale-[1.03] transition-all duration-200"
                    >
                        <Plus size={48} className="mb-2" />
                        <span>Unirse</span>
                    </button>
                    <button
                        onClick={handleScheduleMeeting}
                        className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#6d9b96] hover:bg-[#5a827d] text-white font-semibold text-lg shadow-lg transform hover:scale-[1.03] transition-all duration-200"
                    >
                        <CalendarDays size={48} className="mb-2" />
                        <span>Programar</span>
                    </button>
                    <button
                        onClick={handleShareScreen}
                        className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#6d9b96] hover:bg-[#5a827d] text-white font-semibold text-lg shadow-lg transform hover:scale-[1.03] transition-all duration-200"
                    >
                        <MonitorUp size={48} className="mb-2" />
                        <span>Compartir Pantalla</span>
                    </button>
                </div>

                {createError && (
                    <p className="max-w-4xl mx-auto mt-4 text-center text-red-600 bg-red-50 p-3 rounded border border-red-200">{createError}</p>
                )}

                <div className="max-w-4xl mx-auto mt-12 border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Próximas Reuniones</h2>

                    {/* BLOQUE DE RENDERIZADO DINÁMICO (LA SOLUCIÓN) */}
                    {isLoading && (
                         <div className="bg-blue-50 p-6 rounded-xl text-center text-blue-600 border border-dashed border-blue-200">
                             Cargando reuniones...
                         </div>
                    )}
                    
                    {!isLoading && fetchError && (
                        <div className="bg-red-50 p-6 rounded-xl text-center text-red-600 border border-dashed border-red-200">
                            {fetchError}
                        </div>
                    )}

                    {/* Mapea y muestra las tarjetas si hay datos */}
                    {!isLoading && !fetchError && upcomingInterviews.length > 0 ? (
                        upcomingInterviews.map(interview => (
                            <InterviewCard key={interview.id_entrevista} interview={interview} />
                        ))
                    ) : (
                        // Muestra el mensaje de vacío si no hay datos
                        !isLoading && (
                            <div className="bg-gray-50 p-6 rounded-xl text-center text-gray-500 border border-dashed border-gray-300">
                                No hay reuniones programadas actualmente.
                            </div>
                        )
                    )}
                </div>

            </div>
        </MainLayout>
    );
};

export default MyCallsPage;