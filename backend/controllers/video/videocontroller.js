// backend/controllers/videoController.js
const db = require('../db'); // Asegúrate que la ruta a tu conexión de BD sea correcta
const { v4: uuidV4 } = require('uuid'); // Necesitarás instalar uuid: npm install uuid

// Agendar una nueva videollamada
exports.scheduleCall = async (req, res) => {
    // IMPORTANTE: Deberías obtener el userId del token de autenticación
    const created_by_user_id = req.user.id; // Asumiendo que tu middleware de auth añade 'user' a 'req'
    const { title, scheduled_at } = req.body;

    if (!title || !scheduled_at) {
        return res.status(400).json({ message: 'El título y la fecha son requeridos.' });
    }

    const roomId = `busquidy-call-${uuidV4()}`; // Genera un ID de sala único

    try {
        const query = `
            INSERT INTO scheduled_calls (room_id, title, scheduled_at, created_by_user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [roomId, title, scheduled_at, created_by_user_id];
        const { rows } = await db.query(query, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al agendar la llamada:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener las llamadas agendadas (aquí puedes añadir lógica para obtener solo las del usuario)
exports.getScheduledCalls = async (req, res) => {
    try {
        // Por ahora trae todas, idealmente aquí filtrarías por usuario
        const query = `SELECT * FROM scheduled_calls WHERE scheduled_at >= NOW() ORDER BY scheduled_at ASC;`;
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las llamadas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};