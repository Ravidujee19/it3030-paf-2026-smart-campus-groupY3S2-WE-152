import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api'; // Adjust base URL as needed

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Ticket Service class to handle all ticket-related API calls.
 */
class TicketService {
  /**
   * Fetch all tickets from the backend.
   * @returns {Promise<Array>} List of tickets
   */
  async getAllTickets() {
    try {
      const response = await apiClient.get('/tickets');
      return response.data;
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      throw error;
    }
  }

  /**
   * Fetch a single ticket by its ID.
   * @param {string|number} id - The ticket ID
   * @returns {Promise<Object>} Ticket details
   */
  async getTicketById(id) {
    try {
      const response = await apiClient.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new ticket with optional image attachments.
   * @param {Object} ticketData - The ticket details
   * @param {Array<File>} images - Array of up to 3 image files
   * @returns {Promise<Object>} The created ticket
   */
  async createTicket(ticketData, images = []) {
    try {
      const formData = new FormData();
      
      // Append ticket data as a stringified blob or individual fields depending on backend expectation.
      // Assuming individual fields for simplicity, or a 'ticket' field for the JSON part.
      formData.append('ticket', new Blob([JSON.stringify(ticketData)], { type: 'application/json' }));
      
      // Append images
      images.slice(0, 3).forEach((image, index) => {
        formData.append('attachments', image);
      });

      const response = await apiClient.post('/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  /**
   * Update the workflow status of a ticket.
   * @param {string|number} id - Ticket ID
   * @param {string} status - New status (e.g., 'IN_PROGRESS', 'RESOLVED')
   * @returns {Promise<Object>} Updated ticket
   */
  async updateTicketStatus(id, status) {
    try {
      const response = await apiClient.patch(`/tickets/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for ticket ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetch all comments for a specific ticket.
   * @param {string|number} ticketId - Ticket ID
   * @returns {Promise<Array>} List of comments
   */
  async getCommentsByTicket(ticketId) {
    try {
      const response = await apiClient.get(`/tickets/${ticketId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for ticket ${ticketId}:`, error);
      throw error;
    }
  }

  /**
   * Add a comment to a specific ticket.
   * @param {string|number} id - Ticket ID
   * @param {Object} commentData - Comment details
   * @returns {Promise<Object>} Added comment
   */
  async addComment(id, commentData) {
    try {
      const response = await apiClient.post(`/tickets/${id}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to ticket ${id}:`, error);
      throw error;
    }
  }

  /**
   * Edit an existing comment.
   * @param {string|number} id - Comment ID
   * @param {Object} commentData - Updated comment details
   * @returns {Promise<Object>} Updated comment
   */
  async editComment(id, commentData) {
    try {
      const response = await apiClient.put(`/tickets/comments/${id}`, commentData);
      return response.data;
    } catch (error) {
      console.error(`Error editing comment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a comment by ID, identifying the user performing the deletion.
   * @param {string|number} id - Comment ID
   * @param {string|number} userId - ID of the user deleting the comment
   * @returns {Promise<void>}
   */
  async deleteComment(id, userId) {
    try {
      await apiClient.delete(`/tickets/comments/${id}`, {
        params: { userId },
      });
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      throw error;
    }
  }
}

export default new TicketService();
