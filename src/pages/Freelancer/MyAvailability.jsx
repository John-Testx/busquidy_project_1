import React, { useState, useEffect } from 'react';
import { FaClock, FaCalendarAlt, FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const MyAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [selectedDay, setSelectedDay] = useState(diasSemana[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' o 'list'

    // Simulación de datos para demo
    useEffect(() => {
        setAvailability([
            { id_disponibilidad: 1, dia_semana: 'lunes', hora_inicio: '09:00', hora_fin: '11:00' },
            { id_disponibilidad: 2, dia_semana: 'lunes', hora_inicio: '14:00', hora_fin: '16:00' },
            { id_disponibilidad: 3, dia_semana: 'martes', hora_inicio: '10:00', hora_fin: '12:00' },
            { id_disponibilidad: 4, dia_semana: 'miércoles', hora_inicio: '09:00', hora_fin: '11:00' },
            { id_disponibilidad: 5, dia_semana: 'jueves', hora_inicio: '15:00', hora_fin: '17:00' },
            { id_disponibilidad: 6, dia_semana: 'viernes', hora_inicio: '10:00', hora_fin: '13:00' },
        ]);
    }, []);

    const handleAddAvailability = () => {
        if (!startTime || !endTime) {
            setError("Debes seleccionar una hora de inicio y fin.");
            return;
        }
        if (startTime >= endTime) {
            setError("La hora de inicio debe ser anterior a la hora de fin.");
            return;
        }

        const newId = Math.max(...availability.map(a => a.id_disponibilidad), 0) + 1;
        const newAvailability = {
            id_disponibilidad: newId,
            dia_semana: selectedDay,
            hora_inicio: startTime,
            hora_fin: endTime
        };

        setAvailability([...availability, newAvailability]);
        setStartTime('');
        setEndTime('');
        setError('');
        setSuccessMessage('Horario añadido exitosamente');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleDelete = (availabilityId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este bloque de horario?")) {
            setAvailability(availability.filter(a => a.id_disponibilidad !== availabilityId));
            setSuccessMessage('Horario eliminado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    // Generar las horas del día (8:00 - 22:00)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 22; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Convertir hora a posición en el grid
    const timeToPosition = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const startMinutes = 8 * 60; // 8:00 AM
        return ((totalMinutes - startMinutes) / 60) * 60; // 60px por hora
    };

    // Calcular altura del bloque
    const calculateHeight = (start, end) => {
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);
        const durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
        return (durationMinutes / 60) * 60; // 60px por hora
    };

    const availabilityByDay = diasSemana.reduce((acc, dia) => {
        acc[dia] = (availability || []).filter(slot => slot.dia_semana === dia);
        return acc;
    }, {});

    return (
        <div className="max-w-[1600px] mx-auto p-6">
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
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
                    <p className="text-green-800 font-semibold">{successMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Form Card */}
                <div className="xl:col-span-1">
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

                        <div className="p-6 space-y-5">
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

                            <button 
                                onClick={handleAddAvailability}
                                className="w-full bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <FaPlus />
                                Añadir Horario
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar/List View */}
                <div className="xl:col-span-3">
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
                                                    {/* Hora */}
                                                    <div className="bg-gray-50 p-2 text-right pr-4 font-mono text-sm text-gray-600 h-[60px] flex items-center justify-end border-b border-gray-200">
                                                        {time}
                                                    </div>
                                                    {/* Celdas de días */}
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
                                        {diasSemana.map((dia, diaIndex) => {
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAvailability;