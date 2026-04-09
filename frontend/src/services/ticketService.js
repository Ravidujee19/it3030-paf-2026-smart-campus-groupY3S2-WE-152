import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

// ──────────────────────────────────────────────
// TICKET ENDPOINTS
// ──────────────────────────────────────────────

/**
 * GET /api/tickets — Fetch all tickets, optionally filtered by status.
 */
export const getAllTickets = async (status = null) => {
  const params = status ? { status } : {};
  const response = await API.get("/api/tickets", { params });
  return response.data;
};

/**
 * GET /api/tickets/:id — Fetch a single ticket by ID.
 */
export const getTicketById = async (id) => {
  const response = await API.get(`/api/tickets/${id}`);
  return response.data;
};

/**
 * GET /api/tickets/user/:userId — Fetch tickets created by a specific user.
 */
export const getTicketsByUser = async (userId) => {
  const response = await API.get(`/api/tickets/user/${userId}`);
  return response.data;
};

/**
 * GET /api/tickets/assigned/:technicianId — Fetch tickets assigned to a technician.
 */
export const getTicketsByAssignee = async (technicianId) => {
  const response = await API.get(`/api/tickets/assigned/${technicianId}`);
  return response.data;
};

/**
 * POST /api/tickets — Create a new ticket.
 */
export const createTicket = async (ticketData) => {
  const response = await API.post("/api/tickets", ticketData);
  return response.data;
};

/**
 * PATCH /api/tickets/:id/status — Update a ticket's workflow status.
 */
export const updateTicketStatus = async (id, status) => {
  const response = await API.patch(`/api/tickets/${id}/status`, { status });
  return response.data;
};

/**
 * PATCH /api/tickets/:id/assign — Assign a technician to a ticket.
 */
export const assignTechnician = async (id, technicianId) => {
  const response = await API.patch(`/api/tickets/${id}/assign`, null, {
    params: { technicianId },
  });
  return response.data;
};

/**
 * DELETE /api/tickets/:id — Delete a ticket.
 */
export const deleteTicket = async (id) => {
  const response = await API.delete(`/api/tickets/${id}`);
  return response.data;
};

// ──────────────────────────────────────────────
// COMMENT ENDPOINTS
// ──────────────────────────────────────────────

/**
 * GET /api/tickets/:ticketId/comments — Fetch all comments for a ticket.
 */
export const getCommentsByTicket = async (ticketId) => {
  const response = await API.get(`/api/tickets/${ticketId}/comments`);
  return response.data;
};

/**
 * POST /api/tickets/:ticketId/comments — Add a comment to a ticket.
 */
export const addComment = async (ticketId, commentData) => {
  const response = await API.post(`/api/tickets/${ticketId}/comments`, commentData);
  return response.data;
};

/**
 * PUT /api/tickets/comments/:commentId — Edit a comment (ownership enforced).
 */
export const editComment = async (commentId, commentData) => {
  const response = await API.put(`/api/tickets/comments/${commentId}`, commentData);
  return response.data;
};

/**
 * DELETE /api/tickets/comments/:commentId?userId=:userId — Delete a comment (ownership enforced).
 */
export const deleteComment = async (commentId, userId) => {
  const response = await API.delete(`/api/tickets/comments/${commentId}`, {
    params: { userId },
  });
  return response.data;
};

// ──────────────────────────────────────────────
// ATTACHMENT ENDPOINTS
// ──────────────────────────────────────────────

/**
 * POST /api/tickets/:ticketId/attachments — Upload attachments for a ticket.
 */
export const uploadAttachments = async (ticketId, files, userId) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('userId', userId);

  const response = await API.post(`/api/tickets/${ticketId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default {
  getAllTickets,
  getTicketById,
  getTicketsByUser,
  getTicketsByAssignee,
  createTicket,
  updateTicketStatus,
  assignTechnician,
  deleteTicket,
  getCommentsByTicket,
  addComment,
  editComment,
  deleteComment,
  uploadAttachments,
};
