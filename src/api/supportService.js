import axios from "axios";

const API_URL = "http://localhost:3001/api/support";

// ============= FUNCIONES PÚBLICAS (sin token) =============

// Crear ticket público (sin login)
export const createPublicTicket = async (data) => {
  return axios.post(`${API_URL}/publico`, data);
};

// Obtener tickets por email (sin login)
export const getTicketsByEmail = async (email) => {
  return axios.get(`${API_URL}/publico/email`, {
    params: { email }
  });
};

// Obtener detalles de ticket público
export const getPublicTicketDetails = async (id_ticket, email) => {
  return axios.get(`${API_URL}/publico/${id_ticket}`, {
    params: { email }
  });
};

// Obtener mensajes de ticket público
export const getPublicTicketMessages = async (id_ticket, email) => {
  return axios.get(`${API_URL}/publico/${id_ticket}/mensajes`, {
    params: { email }
  });
};

// Enviar mensaje a ticket público
export const sendPublicTicketMessage = async (id_ticket, mensaje, email) => {
  return axios.post(
    `${API_URL}/publico/${id_ticket}/mensajes`,
    { mensaje, email }
  );
};

// ============= FUNCIONES AUTENTICADAS (con token) =============

// Crear ticket autenticado
export const createTicket = async (data, token) => {
  return axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Obtener tickets del usuario autenticado
export const getUserTickets = async (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Obtener detalles de un ticket específico
export const getTicketDetails = async (id_ticket, token) => {
  return axios.get(`${API_URL}/${id_ticket}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Obtener mensajes de un ticket
export const getTicketMessages = async (id_ticket, token) => {
  return axios.get(`${API_URL}/${id_ticket}/mensajes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Enviar mensaje en un ticket
export const sendTicketMessage = async (id_ticket, mensaje, token) => {
  return axios.post(
    `${API_URL}/${id_ticket}/mensajes`,
    { mensaje },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// Actualizar estado del ticket (solo admin)
export const updateTicketStatus = async (id_ticket, estado, token) => {
  return axios.patch(
    `${API_URL}/${id_ticket}/estado`,
    { estado },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// Asignar ticket a un admin (solo admin)
export const assignTicket = async (id_ticket, id_admin_asignado, token) => {
  return axios.patch(
    `${API_URL}/${id_ticket}/asignar`,
    { id_admin_asignado },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};