const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Usaremos UUID para generar IDs únicos de sala
const router = express.Router();

// POST /api/rooms/create
router.post('/create', (req, res) => {
  try {
    // 1. Destructuramos los datos que envía el frontend desde req.body
    const {
      creatorName,
      meetingTitle,
      duration,
      password,
      scheduled,
      scheduledDateTime,
      settings
    } = req.body;

    // 2. Validación básica (puedes expandirla mucho más)
    if (!creatorName || !meetingTitle) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del anfitrión y el título de la reunión son obligatorios.'
      });
    }

    // 3. Generamos un ID único para la nueva sala de reunión
    const roomId = uuidv4();

    // 4. (Opcional) Aquí guardarías la información de la sala en tu base de datos
    // Por ahora, solo la mostraremos en la consola para verificar que llega bien.
    console.log('✅ Nueva reunión creada:');
    console.log({
      roomId,
      creatorName,
      meetingTitle,
      duration,
      password,
      scheduled,
      scheduledDateTime,
      settings
    });

    // 5. Construimos la URL para unirse, que el frontend espera
    const joinUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/room/${roomId}`;

    // 6. Enviamos una respuesta exitosa al frontend
    res.status(201).json({
      success: true,
      message: 'Reunión creada exitosamente.',
      roomId: roomId,
      joinUrl: joinUrl
    });

  } catch (error) {
    console.error('Error al crear la reunión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear la reunión.'
    });
  }
});

module.exports = router;