// src/pages/Video/MyCallsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Asumo que tienes un apiClient para hacer llamadas a la API
import apiClient from '@/api/apiClient'; 

const MyCallsPage = () => {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/video/scheduled')
            .then(response => {
                setCalls(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching scheduled calls:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando llamadas...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Videollamadas Agendadas</h1>
            {/* Aquí iría el formulario para agendar una nueva */}
            <div className="space-y-4">
                {calls.length > 0 ? (
                    calls.map(call => (
                        <div key={call.id} className="p-4 bg-gray-100 rounded-lg shadow flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">{call.title}</h2>
                                <p>Fecha: {new Date(call.scheduled_at).toLocaleString()}</p>
                            </div>
                            <Link to={`/video/${call.room_id}`} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                                Unirse a la Llamada
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No hay videollamadas agendadas.</p>
                )}
            </div>
        </div>
    );
};

export default MyCallsPage;