const express = require("express");
const {
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
} = require("../controllers/soporteController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

// ============= RUTAS PÚBLICAS (sin token requerido) =============
router.post("/publico", crearTicketPublico);
router.get("/publico/email", obtenerTicketsPorEmail);
router.get("/publico/:id_ticket", obtenerTicketPublico);
router.get("/publico/:id_ticket/mensajes", obtenerMensajesPublico);
router.post("/publico/:id_ticket/mensajes", enviarMensajePublico);

// ============= RUTAS AUTENTICADAS (token requerido) =============
router.post("/", verifyToken, crearTicket);
router.get("/", verifyToken, obtenerTicketsUsuario);
router.get("/:id_ticket", verifyToken, obtenerTicket);
router.get("/:id_ticket/mensajes", verifyToken, obtenerMensajes);
router.post("/:id_ticket/mensajes", verifyToken, enviarMensaje);
router.patch("/:id_ticket/estado", verifyToken, actualizarEstadoTicket);
router.patch("/:id_ticket/asignar", verifyToken, asignarTicket);

module.exports = router;