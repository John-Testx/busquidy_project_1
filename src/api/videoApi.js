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
 * (En veremos) Obtiene el historial de llamadas del usuario.
 * @returns {Promise<Array>} Una promesa que resuelve con un array del historial de llamadas.
 * @throws {Error} Si ocurre un error durante la llamada a la API.
 */
export const getCallHistory = async () => {
  try {
    // Llama al endpoint del backend para obtener el historial.
    // Ajusta '/video/history' si tu endpoint es diferente.
    const response = await apiClient.get('/video/history');
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de llamadas:', error.response?.data || error.message);
    throw error;
  }
};

// Puedes añadir más funciones relacionadas con video aquí si es necesario.