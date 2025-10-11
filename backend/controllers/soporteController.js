const { pool } = require("../db");

// ============= RUTAS PÚBLICAS (Sin autenticación) =============

// Crear ticket anónimo (sin login)
const crearTicketPublico = async (req, res) => {
  try {
    const { asunto, categoria, prioridad, nombre_contacto, email_contacto, mensaje_inicial } = req.body;

    // Validaciones
    if (!asunto || asunto.trim() === "") {
      return res.status(400).json({ error: "El asunto es requerido" });
    }

    if (!nombre_contacto || nombre_contacto.trim() === "") {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    if (!email_contacto || !email_contacto.includes("@")) {
      return res.status(400).json({ error: "El email es requerido y debe ser válido" });
    }

    if (!mensaje_inicial || mensaje_inicial.trim() === "") {
      return res.status(400).json({ error: "El mensaje inicial es requerido" });
    }

    // Crear ticket anónimo
    const [result] = await pool.query(
      `INSERT INTO soporte_ticket 
        (id_usuario, asunto, categoria, prioridad, nombre_contacto, email_contacto, es_anonimo)
       VALUES (NULL, ?, ?, ?, ?, ?, TRUE)`,
      [asunto, categoria || 'Otro', prioridad || 'media', nombre_contacto, email_contacto]
    );

    const id_ticket = result.insertId;

    // Insertar mensaje inicial
    await pool.query(
      `INSERT INTO soporte_mensaje (id_ticket, id_usuario, id_admin, mensaje, remitente)
       VALUES (?, NULL, NULL, ?, 'usuario')`,
      [id_ticket, mensaje_inicial]
    );

    res.status(201).json({
      message: "Ticket creado exitosamente",
      id_ticket: id_ticket,
      codigo_seguimiento: `TK-${id_ticket}-${Date.now().toString().slice(-6)}`
    });
  } catch (error) {
    console.error("Error al crear ticket público:", error);
    res.status(500).json({ error: "Error al crear el ticket" });
  }
};

// Obtener ticket por email (para usuarios no autenticados)
const obtenerTicketsPorEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Email válido requerido" });
    }

    const [tickets] = await pool.query(
      `SELECT * FROM soporte_ticket 
       WHERE email_contacto = ? AND es_anonimo = TRUE
       ORDER BY fecha_creacion DESC`,
      [email]
    );

    res.json(tickets);
  } catch (error) {
    console.error("Error al obtener tickets por email:", error);
    res.status(500).json({ error: "Error al obtener los tickets" });
  }
};

// Obtener ticket público por ID y email (verificación de propiedad)
const obtenerTicketPublico = async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    const [tickets] = await pool.query(
      `SELECT * FROM soporte_ticket 
       WHERE id_ticket = ? AND email_contacto = ? AND es_anonimo = TRUE`,
      [id_ticket, email]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(tickets[0]);
  } catch (error) {
    console.error("Error al obtener ticket público:", error);
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};

// Obtener mensajes de ticket público
const obtenerMensajesPublico = async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    // Verificar que el ticket pertenece al email
    const [tickets] = await pool.query(
      `SELECT id_ticket FROM soporte_ticket 
       WHERE id_ticket = ? AND email_contacto = ? AND es_anonimo = TRUE`,
      [id_ticket, email]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    const [mensajes] = await pool.query(
      `SELECT 
        m.*,
        CASE 
          WHEN m.remitente = 'administrador' THEN a.nombre
          ELSE 'Tú'
        END as nombre_remitente
       FROM soporte_mensaje m
       LEFT JOIN administrador a ON m.id_admin = a.id_administrador
       WHERE m.id_ticket = ? 
       ORDER BY m.fecha_envio ASC`,
      [id_ticket]
    );

    res.json(mensajes);
  } catch (error) {
    console.error("Error al obtener mensajes públicos:", error);
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

// Enviar mensaje en ticket público
const enviarMensajePublico = async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { mensaje, email } = req.body;

    if (!mensaje || mensaje.trim() === "") {
      return res.status(400).json({ error: "El mensaje no puede estar vacío" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    // Verificar que el ticket existe y pertenece al email
    const [tickets] = await pool.query(
      `SELECT estado, email_contacto FROM soporte_ticket 
       WHERE id_ticket = ? AND email_contacto = ? AND es_anonimo = TRUE`,
      [id_ticket, email]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    if (tickets[0].estado === 'cerrado') {
      return res.status(400).json({ error: "No se pueden enviar mensajes a tickets cerrados" });
    }

    await pool.query(
      `INSERT INTO soporte_mensaje (id_ticket, id_usuario, id_admin, mensaje, remitente)
       VALUES (?, NULL, NULL, ?, 'usuario')`,
      [id_ticket, mensaje]
    );

    res.status(201).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar mensaje público:", error);
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};

// ============= RUTAS AUTENTICADAS (Con login) =============

// Crear ticket autenticado
const crearTicket = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const { asunto, categoria, prioridad, mensaje_inicial } = req.body;

    if (!asunto || asunto.trim() === "") {
      return res.status(400).json({ error: "El asunto es requerido" });
    }

    const [result] = await pool.query(
      `INSERT INTO soporte_ticket (id_usuario, asunto, categoria, prioridad, es_anonimo)
       VALUES (?, ?, ?, ?, FALSE)`,
      [id_usuario, asunto, categoria || 'Otro', prioridad || 'media']
    );

    const id_ticket = result.insertId;

    // Si hay mensaje inicial, insertarlo
    if (mensaje_inicial && mensaje_inicial.trim() !== "") {
      await pool.query(
        `INSERT INTO soporte_mensaje (id_ticket, id_usuario, id_admin, mensaje, remitente)
         VALUES (?, ?, NULL, ?, 'usuario')`,
        [id_ticket, id_usuario, mensaje_inicial]
      );
    }

    res.status(201).json({
      message: "Ticket creado exitosamente",
      id_ticket: id_ticket
    });
  } catch (error) {
    console.error("Error al crear ticket:", error);
    res.status(500).json({ error: "Error al crear el ticket" });
  }
};

// Listar tickets del usuario autenticado
const obtenerTicketsUsuario = async (req, res) => {
  try {
    const { id_usuario, tipo_usuario } = req.user;

    let query;
    let params;

    if (tipo_usuario === "administrador") {
      query = `SELECT 
                t.*,
                u.nombre as nombre_usuario,
                u.email as email_usuario
               FROM soporte_ticket t
               LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
               ORDER BY 
                 CASE 
                   WHEN t.prioridad = 'alta' THEN 1
                   WHEN t.prioridad = 'media' THEN 2
                   WHEN t.prioridad = 'baja' THEN 3
                 END,
                 t.fecha_creacion DESC`;
      params = [];
    } else {
      query = `SELECT * FROM soporte_ticket 
               WHERE id_usuario = ? AND es_anonimo = FALSE
               ORDER BY fecha_creacion DESC`;
      params = [id_usuario];
    }

    const [tickets] = await pool.query(query, params);
    res.json(tickets);
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    res.status(500).json({ error: "Error al obtener los tickets" });
  }
};

// Resto de funciones autenticadas (sin cambios)
const obtenerTicket = async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { id_usuario, tipo_usuario } = req.user;

    const [tickets] = await pool.query(
      `SELECT 
        t.*,
        u.nombre as nombre_usuario,
        u.email as email_usuario,
        a.nombre as nombre_admin
       FROM soporte_ticket t
       LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
       LEFT JOIN administrador a ON t.id_admin_asignado = a.id_administrador
       WHERE t.id_ticket = ?`,
      [id_ticket]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    const ticket = tickets[0];

    if (tipo_usuario !== "administrador" && ticket.id_usuario !== id_usuario) {
      return res.status(403).json({ error: "No tienes permiso para ver este ticket" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error al obtener ticket:", error);
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};

const obtenerMensajes = async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { id_usuario, tipo_usuario } = req.user;

    const [tickets] = await pool.query(
      `SELECT id_usuario FROM soporte_ticket WHERE id_ticket = ?`,
      [id_ticket]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    if (tipo_usuario !== "administrador" && tickets[0].id_usuario !== id_usuario) {
      return res.status(403).json({ error: "No tienes permiso para ver estos mensajes" });
    }

    const [mensajes] = await pool.query(
      `SELECT 
        m.*,
        CASE 
          WHEN m.remitente = 'usuario' THEN u.nombre
          WHEN m.remitente = 'administrador' THEN a.nombre
        END as nombre_remitente
       FROM soporte_mensaje m
       LEFT JOIN usuario u ON m.id_usuario = u.id_usuario
       LEFT JOIN administrador a ON m.id_admin = a.id_administrador
       WHERE m.id_ticket = ? 
       ORDER BY m.fecha_envio ASC`,
      [id_ticket]
    );

    res.json(mensajes);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({ error: "Error al obtener los mensajes del ticket" });
  }
};

const enviarMensaje = async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { mensaje } = req.body;
    const { id_usuario, tipo_usuario } = req.user;

    if (!mensaje || mensaje.trim() === "") {
      return res.status(400).json({ error: "El mensaje no puede estar vacío" });
    }

    const [tickets] = await pool.query(
      `SELECT id_usuario, estado FROM soporte_ticket WHERE id_ticket = ?`,
      [id_ticket]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    const ticket = tickets[0];

    if (tipo_usuario !== "administrador" && ticket.id_usuario !== id_usuario) {
      return res.status(403).json({ error: "No tienes permiso para enviar mensajes a este ticket" });
    }

    if (ticket.estado === 'cerrado') {
      return res.status(400).json({ error: "No se pueden enviar mensajes a tickets cerrados" });
    }

    const remitente = tipo_usuario === "administrador" ? "administrador" : "usuario";
    const id_admin = remitente === "administrador" ? id_usuario : null;
    const id_user = remitente === "usuario" ? id_usuario : null;

    await pool.query(
      `INSERT INTO soporte_mensaje (id_ticket, id_usuario, id_admin, mensaje, remitente)
       VALUES (?, ?, ?, ?, ?)`,
      [id_ticket, id_user, id_admin, mensaje, remitente]
    );

    if (remitente === "administrador" && ticket.estado === 'pendiente') {
      await pool.query(
        `UPDATE soporte_ticket SET estado = 'en proceso' WHERE id_ticket = ?`,
        [id_ticket]
      );
    }

    res.status(201).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};

const actualizarEstadoTicket = async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { estado } = req.body;
    const { tipo_usuario } = req.user;

    if (tipo_usuario !== "administrador") {
      return res.status(403).json({ error: "Solo administradores pueden cambiar el estado" });
    }

    const estadosValidos = ['pendiente', 'en proceso', 'resuelto', 'cerrado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    await pool.query(
      `UPDATE soporte_ticket SET estado = ? WHERE id_ticket = ?`,
      [estado, id_ticket]
    );

    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
};

const asignarTicket = async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { id_admin_asignado } = req.body;
    const { tipo_usuario } = req.user;

    if (tipo_usuario !== "administrador") {
      return res.status(403).json({ error: "Solo administradores pueden asignar tickets" });
    }

    await pool.query(
      `UPDATE soporte_ticket SET id_admin_asignado = ? WHERE id_ticket = ?`,
      [id_admin_asignado, id_ticket]
    );

    res.json({ message: "Ticket asignado correctamente" });
  } catch (error) {
    console.error("Error al asignar ticket:", error);
    res.status(500).json({ error: "Error al asignar el ticket" });
  }
};

module.exports = {
  // Rutas públicas
  crearTicketPublico,
  obtenerTicketsPorEmail,
  obtenerTicketPublico,
  obtenerMensajesPublico,
  enviarMensajePublico,
  // Rutas autenticadas
  crearTicket,
  obtenerTicketsUsuario,
  obtenerTicket,
  obtenerMensajes,
  enviarMensaje,
  actualizarEstadoTicket,
  asignarTicket
};