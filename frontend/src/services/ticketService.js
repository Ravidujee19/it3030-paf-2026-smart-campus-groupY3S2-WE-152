import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

export const getAllTickets = async (status = null) => {
  const params = status ? { status } : {};
  const response = await API.get("/api/tickets", { params });
  return response.data;
};

export const getTicketById = async (id) => {
  const response = await API.get(`/api/tickets/${id}`);
  return response.data;
};

export const getTicketsByUser = async (userId) => {
  const response = await API.get(`/api/tickets/user/${userId}`);
  return response.data;
};

export const getTicketsByAssignee = async (technicianId) => {
  const response = await API.get(`/api/tickets/assigned/${technicianId}`);
  return response.data;
};

export const getMyTickets = async () => {
  const response = await API.get('/api/tickets/my');
  return response.data;
};

export const createTicket = async (ticketData) => {
  const response = await API.post("/api/tickets", ticketData);
  return response.data;
};

export const updateTicketStatus = async (id, status) => {
  const response = await API.patch(`/api/tickets/${id}/status`, { status });
  return response.data;
};

export const assignTechnician = async (id, technicianId) => {
  const response = await API.patch(`/api/tickets/${id}/assign`, null, {
    params: { technicianId },
  });
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await API.delete(`/api/tickets/${id}`);
  return response.data;
};

export const uploadAttachments = async (ticketId, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  
  const response = await API.post(`/api/tickets/${ticketId}/attachments`, formData);
  return response.data;
};

export const getAttachments = async (ticketId) => {
  const response = await API.get(`/api/tickets/${ticketId}/attachments`);
  return response.data;
};

export const deleteAttachment = async (attachmentId) => {
  const response = await API.delete(`/api/tickets/attachments/${attachmentId}`);
  return response.data;
};


export const getCommentsByTicket = async (ticketId) => {
  const response = await API.get(`/api/tickets/${ticketId}/comments`);
  return response.data;
};

export const addComment = async (ticketId, commentData) => {
  const response = await API.post(`/api/tickets/${ticketId}/comments`, commentData);
  return response.data;
};

export const editComment = async (commentId, commentData) => {
  const response = await API.put(`/api/tickets/comments/${commentId}`, commentData);
  return response.data;
};

export const deleteComment = async (commentId, userId) => {
  const response = await API.delete(`/api/tickets/comments/${commentId}`, {
    params: { userId },
  });
  return response.data;
};

export default {
  getAllTickets,
  getTicketById,
  getTicketsByUser,
  getTicketsByAssignee,
  getMyTickets,
  createTicket,
  updateTicketStatus,
  assignTechnician,
  deleteTicket,
  getCommentsByTicket,
  addComment,
  editComment,
  deleteComment,
  uploadAttachments,
  getAttachments,
  deleteAttachment,
};
