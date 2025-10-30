import React, { useState, useEffect } from 'react';
import { getAvailability, addAvailability, deleteAvailability } from '@/api/availabilityApi';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/hooks';
import { FaClock, FaCalendarAlt, FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const MyAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [selectedDay, setSelectedDay] = useState(diasSemana[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const { id_usuario } = useAuth();

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
        if (id_usuario) {
            fetchAvailability();
        }
    }, [id_usuario]);

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
            await addAvailability(availabilityData); 
            setStartTime('');
            setEndTime('');
            setError('');
            setSuccessMessage('Horario añadido exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
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
                setSuccessMessage('Horario eliminado exitosamente');
                setTimeout(() => setSuccessMessage(''), 3000);
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

    const availabilityByDay = diasSemana.reduce((acc, dia) => {
        acc[dia] = (availability || []).filter(slot => slot.dia_semana === dia);
        return acc;
    }, {});

    // ✅ Agregar LoadingScreen para carga inicial
    if (loading) return <LoadingScreen />;
    
    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl flex items-center justify-center">
                        <FaCalendarAlt className="text-white text-xl" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Mi Disponibilidad</h2>
                        <p className="text-gray-600">Define cuándo estás disponible para entrevistas</p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 animate-[modalSlideIn_0.3s_ease-out]">
                    <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
                    <p className="text-green-800 font-semibold">{successMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
                        <div className="bg-gradient-to-br from-[#07767c] to-[#05595d] p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <FaPlus className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Añadir Horario</h3>
                            </div>
                            <p className="text-white/80 text-sm">Crea un nuevo bloque de tiempo</p>
                        </div>

                        <form onSubmit={handleAddAvailability} className="p-6 space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                    <FaCalendarAlt className="text-[#07767c]" />
                                    Día de la semana
                                </label>
                                <select 
                                    value={selectedDay} 
                                    onChange={(e) => setSelectedDay(e.target.value)} 
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-all duration-200 outline-none hover:border-gray-300 bg-white"
                                >
                                    {diasSemana.map(dia => (
                                        <option key={dia} value={dia}>
                                            {dia.charAt(0).toUpperCase() + dia.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                    <FaClock className="text-[#07767c]" />
                                    Hora de inicio
                                </label>
                                <input 
                                    type="time" 
                                    value={startTime} 
                                    onChange={(e) => setStartTime(e.target.value)} 
                                    required 
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-all duration-200 outline-none hover:border-gray-300" 
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                    <FaClock className="text-[#07767c]" />
                                    Hora de fin
                                </label>
                                <input 
                                    type="time" 
                                    value={endTime} 
                                    onChange={(e) => setEndTime(e.target.value)} 
                                    required 
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-all duration-200 outline-none hover:border-gray-300" 
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                                    <p className="text-red-800 text-sm font-semibold text-center">{error}</p>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <FaPlus />
                                Añadir Horario
                            </button>
                        </form>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FaCalendarAlt className="text-[#07767c]" />
                                Tus Horarios Programados
                            </h3>
                        </div>

                        <div className="p-6">
                            {availability.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FaCalendarAlt className="text-gray-400 text-4xl" />
                                    </div>
                                    <p className="text-gray-600 font-semibold text-lg mb-2">No hay horarios configurados</p>
                                    <p className="text-gray-500 text-sm">Añade tu primer bloque de disponibilidad</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {diasSemana.map(dia => {
                                        const slots = availabilityByDay[dia];
                                        if (slots.length === 0) return null;
                                        
                                        return (
                                            <div key={dia} className="border-l-4 border-[#07767c] pl-4">
                                                <h4 className="font-bold text-gray-900 capitalize mb-3 text-lg">
                                                    {dia}
                                                </h4>
                                                <div className="space-y-2">
                                                    {slots.map(slot => (
                                                        <div 
                                                            key={slot.id_disponibilidad} 
                                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#07767c]/30 transition-all duration-300 group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-[#07767c]/10 rounded-lg flex items-center justify-center">
                                                                    <FaClock className="text-[#07767c]" />
                                                                </div>
                                                                <span className="font-bold text-gray-900 font-mono">
                                                                    {formatTime(slot.hora_inicio)} - {formatTime(slot.hora_fin)}
                                                                </span>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleDelete(slot.id_disponibilidad)} 
                                                                className="flex items-center gap-2 bg-white border-2 border-red-200 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                            >
                                                                <FaTrash className="text-sm" />
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAvailability;