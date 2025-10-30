// src/pages/Video/MyCallsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVideoRoom } from '@/api/videoApi'; 
import { useAuth } from '@/hooks/';
import { Video, LogIn } from 'lucide-react';
import MainLayout from '@/components/Layouts/MainLayout'; // <-- 1. IMPORTA EL LAYOUT

const MyCallsPage = () => {
    const navigate = useNavigate();
    
    // --- Estado para "Crear Sala" ---
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState(null);

    // --- Estado para "Unirse a Sala" ---
    const [joinRoomId, setJoinRoomId] = useState('');

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

    const handleJoinRoomSubmit = (e) => {
        e.preventDefault(); 
        if (joinRoomId.trim()) {
            navigate(`/video/${joinRoomId.trim()}`);
        }
    };

    return (
        // --- 2. ENVUELVE TODO EL RETURN CON <MainLayout> ---
        <MainLayout>
            <div className="container mx-auto p-4 pt-20"> 
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Videollamadas</h1>

                {/* Contenedor con 2 opciones */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

                    {/* === Opción 1: Crear Sala === */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Crear una Sala</h2>
                        <p className="text-gray-600 mb-6">
                            Inicia una nueva sala de videollamada y comparte el enlace para que otros se unan.
                        </p>
                        
                        <button
                            onClick={handleCreateAndJoinRoom}
                            disabled={isCreating}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                                isCreating 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-[#055a5f]'
                            }`}
                        >
                            <Video size={18} />
                            {isCreating ? 'Creando...' : 'Crear Sala Nueva'}
                        </button>

                        {createError && (
                            <p className="mt-4 text-center text-red-600 bg-red-50 p-3 rounded border border-red-200">{createError}</p>
                        )}
                    </div>

                    {/* === Opción 2: Unirse a Sala === */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Unirse a una Sala</h2>
                        <p className="text-gray-600 mb-6">
                            Pega el ID o enlace de la sala a la que quieres unirte.
                        </p>
                        
                        <form onSubmit={handleJoinRoomSubmit}>
                            <label htmlFor="room-id" className="block text-sm font-medium text-gray-600 mb-2">
                                ID de la Sala
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="room-id"
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value)}
                                    placeholder="Escribe o pega el ID"
                                    className="w-full pl-3 pr-10 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c]/50 focus:border-[#07767c] focus:outline-none"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1 bottom-1 px-4 bg-[#07767c] text-white rounded-md hover:bg-[#055a5f] shadow-md transition-all duration-300 flex items-center justify-center"
                                    aria-label="Unirse a la sala"
                                >
                                    <LogIn size={18} />
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </MainLayout>
        // --- 3. CIERRA EL <MainLayout> ---
    );
};

export default MyCallsPage;