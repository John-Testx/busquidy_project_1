// src/api/videoApi.js

import apiClient from './apiClient';

/**
 * Crea una nueva sala de videollamada en el backend.
 * @returns {Promise<object>} Una promesa que resuelve con los datos de la sala creada (ej: { roomId: '...' }).
 * @throws {Error} Si ocurre un error durante la llamada a la API.
 */
export const createVideoRoom = async () => {
    try {
        // Llama al endpoint del backend para crear una sala.
        const response = await apiClient.post('/video/create-room'); 
        return response.data; 
    } catch (error) {
        console.error('Error al crear la sala de video:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * 🆕 Obtiene las próximas entrevistas (agendadas y no finalizadas) del usuario.
 * Esta es la función que alimenta la sección "Próximas Reuniones".
 * * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos de entrevista.
 * @throws {Error} Si ocurre un error durante la llamada a la API.
 */
export const fetchUpcomingInterviews = async () => {
    try {
        // Llama al endpoint del backend para obtener las entrevistas programadas.
        // Asegúrate de que el backend filtre por el ID del usuario actual y que la fecha sea futura.
        const response = await apiClient.get('/video/entrevistas/proximas'); 
        
        // El backend debe devolver datos esenciales como: 
        // id_entrevista, room_id, fecha_hora_inicio, nombre_contraparte, etc.
        return response.data;
    } catch (error) {
        console.error('Error al obtener próximas entrevistas:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * (En veremos) Obtiene el historial de llamadas del usuario.
 * @returns {Promise<Array>} Una promesa que resuelve con un array del historial de llamadas.
 * @throws {Error} Si ocurre un error durante la llamada a la API.
 */
export const getCallHistory = async () => {
    try {
        // Llama al endpoint del backend para obtener el historial.
        const response = await apiClient.get('/video/history');
        return response.data;
    } catch (error) {
        console.error('Error al obtener historial de llamadas:', error.response?.data || error.message);
        throw error;
    }
};