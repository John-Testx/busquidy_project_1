import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importa la función específica de tu nueva API
import { createVideoRoom } from '@/api/videoApi'; // Asegúrate que la ruta sea correcta
import { useAuth } from '@/hooks/'; // Hook de autenticación por confirmar

const MyCallsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Puedes usar 'user' si necesitas enviar datos del usuario al crear la sala, aunque createVideoRoom no lo pide actualmente.
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateAndJoinRoom = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 2. Llama directamente a la función de la API
            const roomData = await createVideoRoom(); 

            // 3. Maneja el resultado (igual que antes)
            if (roomData && roomData.roomId) {
                navigate(`/video-call/${roomData.roomId}`);
            } else {
                throw new Error('No se recibió un ID de sala válido del servidor.');
            }
        } catch (err) {
            setError('Error al crear la sala. Inténtalo de nuevo más tarde.');
            console.error("Error en handleCreateAndJoinRoom:", err); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 pt-20"> 
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Mis Videollamadas</h1>

            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Iniciar una nueva llamada</h2>
                <p className="text-gray-600 mb-4">
                    Crea una sala de videollamada para conectarte con otros usuarios.
                </p>
                
                <button
                    onClick={handleCreateAndJoinRoom}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 text-white font-semibold rounded-md transition-colors duration-200 ${
                        isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? 'Creando sala...' : 'Crear y Unirse a Nueva Sala'}
                </button>

                {error && (
                    <p className="mt-4 text-center text-red-600 bg-red-100 p-2 rounded border border-red-300">{error}</p>
                )}

                {/* Puedes añadir aquí la opción de unirse a una sala existente si lo deseas */}
                {/* ... */}
            </div>

            {/* Puedes añadir aquí el historial de llamadas si implementas getCallHistory */}
            {/* ... */}
        </div>
    );
};

export default MyCallsPage;