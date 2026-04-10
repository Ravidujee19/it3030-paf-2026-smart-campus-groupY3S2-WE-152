import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import TicketComments from './TicketComments';
import './TicketDetail.css';

/**
 * Robust Ticket Detail view with status workflow and comments.
 */
const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Mocking currentUserId as 1 for Part 3
  const currentUserId = 1;

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketById(id);
      setTicket(data);
    } catch (err) {
      console.error('Error fetching ticket details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus || newStatus === ticket.status) return;

    try {
      setUpdatingStatus(true);
      await ticketService.updateTicketStatus(id, newStatus);
      // Update local state immediately
      setTicket(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="ticket-detail-page">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <div className="spinner"></div>
          <p>Loading incident details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-page">
        <div className="error-container">
          <h3>Ticket Not Found</h3>
          <p>The ticket you are looking for does not exist or has been removed.</p>
          <button className="btn-details" onClick={() => navigate('/maintenance')}>Return to List</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-detail-page">
      <button 
        className="btn-details" 
        style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        onClick={() => navigate('/maintenance')}
      >
        ← Back to Maintenance
      </button>

      <header className="detail-header">
        <div className="title-section">
          <h2>{ticket.title}</h2>
          <div className="status-row">
            <div className="status-select-container">
              <label>Status</label>
              <select 
                className="status-dropdown" 
                value={ticket.status} 
                onChange={handleStatusChange}
                disabled={updatingStatus}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <span style={{ color: '#636e72', fontSize: '0.9rem' }}>ID: #{ticket.id}</span>
          </div>
        </div>
      </header>

      <div className="detail-grid">
        <div className="main-content">
          <section className="info-card">
            <h3>Incident Description</h3>
            <p className="description-text">{ticket.description}</p>
          </section>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <section className="info-card">
              <h3>Attachments</h3>
              <div className="attachments-grid">
                {ticket.attachments.map((url, idx) => (
                  <div key={idx} className="attachment-item">
                    <img src={url} alt={`Attachment ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="sidebar">
          <div className="info-card">
            <h3>Metadata</h3>
            <ul className="meta-list">
              <li className="meta-row">
                <span className="meta-label">Category</span>
                <span className="meta-value">{ticket.category}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Priority</span>
                <span className={`meta-value priority-${ticket.priority}`}>
                  {ticket.priority}
                </span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Location</span>
                <span className="meta-value">{ticket.location}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Resource</span>
                <span className="meta-value">{ticket.resourceName || 'N/A'}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Created At</span>
                <span className="meta-value">{new Date(ticket.createdAt).toLocaleString()}</span>
              </li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Requester Info</h3>
            <ul className="meta-list">
              <li className="meta-row">
                <span className="meta-label">Email</span>
                <span className="meta-value">{ticket.contactEmail}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Phone</span>
                <span className="meta-value">{ticket.contactPhone}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="section-divider">
        <TicketComments ticketId={id} currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default TicketDetail;
