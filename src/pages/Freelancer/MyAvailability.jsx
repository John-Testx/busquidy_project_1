import React, { useState, useEffect } from 'react';
import { FaClock, FaCalendarAlt, FaPlus, FaTrash, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { getAvailability, addAvailability, deleteAvailability } from '@/api/availabilityApi';

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const MyAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [selectedDay, setSelectedDay] = useState(diasSemana[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' o 'list'
    const [showAddForm, setShowAddForm] = useState(false); // Controla el modal/drawer del formulario

    // 2. AÑADIR ESTADO DE CARGA
    const [isLoading, setIsLoading] = useState(true);

    // 3. REEMPLAZAR EL USEEFFECT DE SIMULACIÓN POR LA LLAMADA A LA API
    useEffect(() => {
        const loadAvailability = async () => {
            setIsLoading(true);
            try {
                // getAvailability() obtiene la disponibilidad del freelancer autenticado (por token)
                const response = await getAvailability(); 
                setAvailability(response.data || []); // El controlador devuelve un array
            } catch (err) {
                console.error("Error al cargar la disponibilidad:", err);
                setError("No se pudo cargar tu disponibilidad. Inténtalo de nuevo.");
            } finally {
                setIsLoading(false);
            }
        };

        loadAvailability();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    // 4. MODIFICAR HANDLER PARA AÑADIR CON API (async)
    const handleAddAvailability = async () => {
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

            // Llamada a la API para añadir
            const response = await addAvailability(availabilityData);

            // El backend devuelve el nuevo objeto con su ID
            // Lo añadimos al estado local
            setAvailability([...availability, response.data]);

            // Limpiar formulario y mostrar éxito
            setStartTime('');
            setEndTime('');
            setError('');
            setSuccessMessage('Horario añadido exitosamente');
            setShowAddForm(false); // Cerrar el formulario después de añadir
            setTimeout(() => setSuccessMessage(''), 3000);
        
        } catch (err) {
            console.error("Error al añadir disponibilidad:", err);
            // Capturar error de duplicado (409) o validación (400)
            const apiError = err.response?.data?.message || "Error al guardar el horario.";
            setError(apiError);
        }
    };

    // 5. MODIFICAR HANDLER PARA ELIMINAR CON API (async)
    const handleDelete = async (availabilityId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este bloque de horario?")) {
            try {
                // Llamada a la API para eliminar
                await deleteAvailability(availabilityId);

                // Actualizar el estado local SÓLO si la API tuvo éxito
                setAvailability(availability.filter(a => a.id_disponibilidad !== availabilityId));
                setSuccessMessage('Horario eliminado exitosamente');
                setTimeout(() => setSuccessMessage(''), 3000);

            } catch (err) {
                console.error("Error al eliminar disponibilidad:", err);
                const apiError = err.response?.data?.message || "No se pudo eliminar el horario.";
                setError(apiError);
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 22; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const timeToPosition = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const startMinutes = 8 * 60;
        return ((totalMinutes - startMinutes) / 60) * 60;
    };

    const calculateHeight = (start, end) => {
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);
        const durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
        return (durationMinutes / 60) * 60;
    };

    const availabilityByDay = diasSemana.reduce((acc, dia) => {
        acc[dia] = (availability || []).filter(slot => slot.dia_semana === dia);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl flex items-center justify-center">
                                <FaCalendarAlt className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Mi Disponibilidad</h2>
                                <p className="text-gray-600">Define cuándo estás disponible para entrevistas</p>
                            </div>
                        </div>

                        {/* Controles de Vista y Añadir */}
                        <div className="flex items-center gap-3">
                            {/* Toggle View Mode */}
                            <div className="flex gap-2 bg-white rounded-xl p-1 shadow-md border border-gray-200">
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                        viewMode === 'calendar'
                                            ? 'bg-gradient-to-r from-[#07767c] to-[#05595d] text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Vista Calendario
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                        viewMode === 'list'
                                            ? 'bg-gradient-to-r from-[#07767c] to-[#05595d] text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Vista Lista
                                </button>
                            </div>

                            {/* Botón Añadir Horario */}
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <FaPlus />
                                Añadir Horario
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                        <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
                        <p className="text-green-800 font-semibold">{successMessage}</p>
                    </div>
                )}
                
                {/* Error Message (para errores de carga o eliminación) */}
                {error && !showAddForm && ( // Ocultar el error general si el formulario (que tiene su propio error) está abierto
                     <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <FaTimes className="text-red-600 text-xl flex-shrink-0" />
                        <p className="text-red-800 font-semibold">{error}</p>
                    </div>
                )}


                {/* Calendar/List View */}
                {viewMode === 'calendar' ? (
                    /* Calendar View */
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FaCalendarAlt className="text-[#07767c]" />
                                Calendario Semanal
                            </h3>
                        </div>

                        <div className="p-6 overflow-x-auto">
                            <div className="min-w-[900px]">
                                {/* Header con días */}
                                <div className="grid grid-cols-8 gap-px bg-gray-200 mb-px">
                                    <div className="bg-white p-4 font-bold text-gray-600 text-sm">Horario</div>
                                    {diasSemana.map(dia => (
                                        <div key={dia} className="bg-gradient-to-br from-[#07767c] to-[#05595d] p-4 text-center">
                                            <div className="text-white font-bold capitalize text-sm">{dia.slice(0, 3).toUpperCase()}</div>
                                            <div className="text-white/80 text-xs mt-1">{dia.slice(3)}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Grid de horarios */}
                                <div className="relative">
                                    <div className="grid grid-cols-8 gap-px bg-gray-200">
                                        {timeSlots.map(time => (
                                            <React.Fragment key={time}>
                                                <div className="bg-gray-50 p-2 text-right pr-4 font-mono text-sm text-gray-600 h-[60px] flex items-center justify-end border-b border-gray-200">
                                                    {time}
                                                </div>
                                                {diasSemana.map(dia => (
                                                    <div 
                                                        key={`${dia}-${time}`} 
                                                        className="bg-white h-[60px] border-b border-gray-100 hover:bg-gray-50 transition-colors relative"
                                                    />
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Bloques de disponibilidad superpuestos */}
                                    {!isLoading && diasSemana.map((dia, diaIndex) => { // Asegurarse de no renderizar si está cargando
                                        const slots = availabilityByDay[dia];
                                        return slots.map(slot => {
                                            const top = timeToPosition(slot.hora_inicio);
                                            const height = calculateHeight(slot.hora_inicio, slot.hora_fin);
                                            const left = `${((diaIndex + 1) / 8) * 100}%`;
                                            const width = `${(1 / 8) * 100}%`;

                                            return (
                                                <div
                                                    key={slot.id_disponibilidad}
                                                    className="absolute group cursor-pointer"
                                                    style={{
                                                        top: `${top}px`,
                                                        left,
                                                        width,
                                                        height: `${height}px`,
                                                        padding: '2px'
                                                    }}
                                                >
                                                    <div className="w-full h-full bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300" />
                                                        <div className="relative z-10">
                                                            <div className="text-white font-bold text-xs mb-1">
                                                                {formatTime(slot.hora_inicio)}
                                                            </div>
                                                            <div className="text-white/90 text-xs">
                                                                {formatTime(slot.hora_fin)}
                                                            </div>
                                                            <button
                                                                onClick={() => handleDelete(slot.id_disponibilidad)}
                                                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                                            >
                                                                <FaTrash className="text-white text-xs" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FaCalendarAlt className="text-[#07767c]" />
                                Lista de Horarios
                            </h3>
                        </div>
                        <div className="p-6">
                            {/* AQUÍ AÑADIMOS EL MANEJO DE CARGA */}
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <FaClock className="text-gray-400 text-4xl animate-spin" />
                                    <p className="text-gray-600 font-semibold text-lg mt-4">Cargando disponibilidad...</p>
                                </div>
                            ) : availability.length === 0 ? (
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
                )}
            </div>

            {/* Modal/Drawer para añadir horario */}
            {showAddForm && (
                <>
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-[fadeIn_0.2s_ease-out]"
                        onClick={() => setShowAddForm(false)}
                    />
                    
                    {/* Drawer desde la derecha */}
                    <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 animate-[slideInRight_0.3s_ease-out]">
                        <div className="h-full flex flex-col">
                            {/* Header del drawer */}
                            <div className="bg-gradient-to-br from-[#07767c] to-[#05595d] p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <FaPlus className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Añadir Horario</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <FaTimes className="text-white" />
                                    </button>
                                </div>
                                <p className="text-white/80 text-sm">Crea un nuevo bloque de tiempo</p>
                            </div>

                            {/* Formulario */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
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
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-all duration-200 outline-none hover:border-gray-300" 
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                                        <p className="text-red-800 text-sm font-semibold text-center">{error}</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer con botones */}
                            <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
                                <button 
                                    onClick={handleAddAvailability}
                                    className="w-full bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <FaPlus />
                                    Añadir Horario
                                </button>
                                <button 
                                    onClick={() => setShowAddForm(false)}
                                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default MyAvailability;