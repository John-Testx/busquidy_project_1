import apiClient from "./apiClient";
const BASE = "/support";

// ========= FUNCIONES PÚBLICAS =========
export const createPublicTicket = (data) => apiClient.post(`${BASE}/publico`, data);

export const getTicketsByEmail = (email) =>
  apiClient.get(`${BASE}/publico/email`, { params: { email } });

export const getPublicTicketDetails = (id_ticket, email) =>
  apiClient.get(`${BASE}/publico/${id_ticket}`, { params: { email } });

export const getPublicTicketMessages = (id_ticket, email) =>
  apiClient.get(`${BASE}/publico/${id_ticket}/mensajes`, { params: { email } });

export const sendPublicTicketMessage = (id_ticket, mensaje, email) =>
  apiClient.post(`${BASE}/publico/${id_ticket}/mensajes`, { mensaje, email });

// ========= FUNCIONES AUTENTICADAS =========
export const createTicket = (data) => apiClient.post(BASE, data);

export const getUserTickets = () => apiClient.get(BASE);

export const getTicketDetails = (id_ticket) => apiClient.get(`${BASE}/${id_ticket}`);

export const getTicketMessages = (id_ticket) => apiClient.get(`${BASE}/${id_ticket}/mensajes`);

export const sendTicketMessage = (id_ticket, mensaje) =>
  apiClient.post(`${BASE}/${id_ticket}/mensajes`, { mensaje });

export const updateTicketStatus = (id_ticket, estado) =>
  apiClient.patch(`${BASE}/${id_ticket}/estado`, { estado });

export const assignTicket = (id_ticket, id_admin_asignado) =>
  apiClient.patch(`${BASE}/${id_ticket}/asignar`, { id_admin_asignado });

// ========= FUNCIONES DE ADMINISTRACIÓN =========
export const getAllTickets = () => apiClient.get(`${BASE}/admin/tickets`);