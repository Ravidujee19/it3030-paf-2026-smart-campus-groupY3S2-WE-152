import axios from 'axios';

/**
 * Backend Base URL.
 * Port 8081 as per Spring Boot configuration.
 */
const API_BASE_URL = 'http://localhost:8081/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * AXIOS INTERCEPTOR:
 * Automatically injects the JWT token from localStorage into the Authorization header.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * BULLETPROOF ENUM MAPPING:
 */
const mapToEnum = (value) => {
  if (!value) return '';
  return value.toString().toUpperCase().trim().replace(/[^A-Z0-9]+/g, '_');
};

/**
 * Ticket Service class - Aligned with existing Java Controllers.
 */
class TicketService {
  /**
   * Universal error handler with browser alerts for exact failure visibility.
   */
  handleError(error, context) {
    const backendData = error.response?.data;
    const detailedMessage = typeof backendData === 'object' ? (backendData.message || JSON.stringify(backendData)) : backendData;
    const finalMessage = detailedMessage || error.message || `Failed to ${context}.`;

    console.error(`Error during ${context}:`, error);
    alert(`CRITICAL ERROR: ${context.toUpperCase()} failed.\nBackend message: ${finalMessage}`);
    throw new Error(finalMessage);
  }

  // ──────────────────────────────────────────────
  // TICKET ACTIONS
  // ──────────────────────────────────────────────

  async getAllTickets() {
    try {
      const response = await apiClient.get('/tickets');
      return response.data;
    } catch (error) { this.handleError(error, 'fetching all tickets'); }
  }

  async getTicketById(id) {
    try {
      const response = await apiClient.get(`/tickets/${id}`);
      return response.data;
    } catch (error) { this.handleError(error, `fetching ticket #${id}`); }
  }

  /**
   * TWO-STEP CREATION PROCESS:
   * Step 1: Create ticket text details via standard application/json.
   * Step 2: Upload images if any.
   */
  async createTicket(ticketData, images = []) {
    try {
      // Step 1: Create text record (JSON)
      const jsonPayload = {
        ...ticketData,
        priority: mapToEnum(ticketData.priority),
        category: mapToEnum(ticketData.category)
      };

      const response = await apiClient.post('/tickets', jsonPayload);
      const newTicket = response.data;
      const ticketId = newTicket.id;

      // Step 2: Upload Images (Multipart)
      if (images && images.length > 0) {
        const formData = new FormData();
        images.slice(0, 3).forEach((image) => {
          formData.append('attachments', image);
        });

        // Use userId from ticketData to identify uploader
        await axios.post(`${API_BASE_URL}/tickets/${ticketId}/attachments`, formData, {
          params: { userId: ticketData.createdByUserId },
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      return newTicket;
    } catch (error) {
      this.handleError(error, 'creating ticket (two-step)');
    }
  }


  async updateTicketStatus(id, status) {
    try {
      const response = await apiClient.patch(`/tickets/${id}/status`, { status: mapToEnum(status) });
      return response.data;
    } catch (error) { this.handleError(error, 'updating status'); }
  }

  async updateTicketPriority(id, priority) {
    try {
      const response = await apiClient.patch(`/tickets/${id}/priority`, null, {
        params: { priority: mapToEnum(priority) }
      });
      return response.data;
    } catch (error) { this.handleError(error, 'updating priority'); }
  }

  async updateTicket(id, ticketData) {
    try {
      const payload = {
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category ? mapToEnum(ticketData.category) : undefined,
        priority: ticketData.priority ? mapToEnum(ticketData.priority) : undefined,
        location: ticketData.location,
        resourceName: ticketData.resourceName,
        contactEmail: ticketData.contactEmail,
        contactPhone: ticketData.contactPhone
      };
      const response = await apiClient.patch(`/tickets/${id}`, payload);
      return response.data;
    } catch (error) { this.handleError(error, 'updating ticket'); }
  }

  // ──────────────────────────────────────────────
  // FILTERING ACTIONS
  // ──────────────────────────────────────────────

  async getTicketsByUser(userId) {
    try {
      const response = await apiClient.get(`/tickets/user/${userId}`);
      return response.data;
    } catch (error) { this.handleError(error, 'fetching user tickets'); }
  }

  async getTicketsByAssignee(technicianId) {
    try {
      const response = await apiClient.get(`/tickets/assigned/${technicianId}`);
      return response.data;
    } catch (error) { this.handleError(error, 'fetching assigned tickets'); }
  }

  // ──────────────────────────────────────────────
  // COMMENTS
  // ──────────────────────────────────────────────

  async getCommentsByTicket(ticketId) {
    try {
      const response = await apiClient.get(`/tickets/${ticketId}/comments`);
      return response.data;
    } catch (error) { this.handleError(error, 'fetching comments'); }
  }

  async addComment(ticketId, commentData) {
    try {
      const payload = { userId: commentData.userId, content: commentData.content };
      const response = await apiClient.post(`/tickets/${ticketId}/comments`, payload);
      return response.data;
    } catch (error) { this.handleError(error, 'adding comment'); }
  }

  async editComment(commentId, commentData) {
    try {
      const payload = { userId: commentData.userId, content: commentData.content };
      const response = await apiClient.put(`/tickets/comments/${commentId}`, payload);
      return response.data;
    } catch (error) { this.handleError(error, 'editing comment'); }
  }

  async deleteComment(commentId, userId) {
    try {
      await apiClient.delete(`/tickets/comments/${commentId}`, { params: { userId } });
    } catch (error) { this.handleError(error, 'deleting comment'); }
  }

  // ──────────────────────────────────────────────
  // OTHER CONTROLS
  // ──────────────────────────────────────────────

  async assignTechnician(id, technicianId) {
    try {
      const response = await apiClient.patch(`/tickets/${id}/assign`, null, { params: { technicianId } });
      return response.data;
    } catch (error) { this.handleError(error, 'assigning technician'); }
  }

  async deleteTicket(id) {
    try {
      await apiClient.delete(`/tickets/${id}`);
    } catch (error) { this.handleError(error, 'deleting ticket'); }
  }
}

const ticketService = new TicketService();
export default ticketService;

// Named exports for backward compatibility
export const getAllTickets = ticketService.getAllTickets.bind(ticketService);
export const getTicketById = ticketService.getTicketById.bind(ticketService);
export const createTicket = ticketService.createTicket.bind(ticketService);
export const updateTicketStatus = ticketService.updateTicketStatus.bind(ticketService);
export const updateTicketPriority = ticketService.updateTicketPriority.bind(ticketService);
export const getCommentsByTicket = ticketService.getCommentsByTicket.bind(ticketService);
export const addComment = ticketService.addComment.bind(ticketService);
export const editComment = ticketService.editComment.bind(ticketService);
export const deleteComment = ticketService.deleteComment.bind(ticketService);
export const assignTechnician = ticketService.assignTechnician.bind(ticketService);
export const deleteTicket = ticketService.deleteTicket.bind(ticketService);
export const getTicketsByUser = ticketService.getTicketsByUser.bind(ticketService);
export const getTicketsByAssignee = ticketService.getTicketsByAssignee.bind(ticketService);
