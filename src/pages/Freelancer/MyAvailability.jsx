import React, { useState, useEffect } from 'react';
import { getAvailability, addAvailability, deleteAvailability } from '@/api/availabilityApi';
import { useAuth } from '@/hooks';

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const MyAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [selectedDay, setSelectedDay] = useState(diasSemana[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { id_usuario } = useAuth(); // <-- THIS IS THE FIX (added parentheses)

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const response = await getAvailability();
            console.log("Current schedule: ", response.data);
            setAvailability(response.data);
            setError('');
        } catch (error) {
            console.error("Error al cargar la disponibilidad:", error);
            setError("No se pudo cargar la disponibilidad. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        // We can add a check to only fetch if the user is authenticated
        if (id_usuario) {
            fetchAvailability();
        }
    }, [id_usuario]); // Dependency array ensures it runs when id_usuario is available

    const handleAddAvailability = async (e) => {
        e.preventDefault();
        if (!startTime || !endTime) {
            setError("Debes seleccionar una hora de inicio y fin.");
            return;
        }
        if (startTime >= endTime) {
            setError("La hora de inicio debe ser anterior a la hora de fin.");
            return;
        }

        try {
            const availabilityData = {
                dia_semana: selectedDay,
                hora_inicio: startTime,
                hora_fin: endTime
            };
            // The API call is correct, it doesn't need id_usuario
            await addAvailability(availabilityData); 
            setStartTime('');
            setEndTime('');
            setError('');
            fetchAvailability();
        } catch (error) {
            console.error("Error al añadir disponibilidad:", error);
            setError(error.response?.data?.message || "Error al guardar el horario.");
        }
    };

    const handleDelete = async (availabilityId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este bloque de horario?")) {
            try {
                await deleteAvailability(availabilityId);
                fetchAvailability();
            } catch (error) {
                console.error("Error al eliminar disponibilidad:", error);
                setError("No se pudo eliminar el horario.");
            }
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    }
    
    // ... Your JSX remains unchanged ...
    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto my-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Gestionar Mi Disponibilidad</h2>
            <p className="text-center text-gray-600 mb-8">Define los bloques de tiempo en los que estás disponible para entrevistas.</p>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* Form Column */}
                <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2 mb-6">Añadir Nuevo Horario</h3>
                    <form onSubmit={handleAddAvailability}>
                        <div className="mb-4">
                            <label className="block mb-2 font-bold text-sm text-gray-700">Día de la semana:</label>
                            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                {diasSemana.map(dia => (
                                    <option key={dia} value={dia}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-bold text-sm text-gray-700">Hora de inicio:</label>
                            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-sm text-gray-700">Hora de fin:</label>
                            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
                        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300">
                            Añadir Horario
                        </button>
                    </form>
                </div>

                {/* List Column */}
                <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-6">Mis Horarios</h3>
                    {loading ? (
                        <p className="text-gray-500 text-center mt-4">Cargando...</p>
                    ) : availability.length === 0 ? (
                        <p className="text-gray-500 text-center mt-4">Aún no has añadido ningún horario.</p>
                    ) : (
                        <ul className="list-none p-0">
                            {availability.map(slot => (
                                <li key={slot.id_disponibilidad} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                                    <span className="text-gray-800">
                                        <strong className="font-medium capitalize">{slot.dia_semana}:</strong> 
                                        <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{formatTime(slot.hora_inicio)} - {formatTime(slot.hora_fin)}</span>
                                    </span>
                                    <button onClick={() => handleDelete(slot.id_disponibilidad)} className="bg-transparent border border-red-500 text-red-500 px-3 py-1 text-xs font-semibold rounded-md hover:bg-red-500 hover:text-white transition-all duration-300">
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAvailability;