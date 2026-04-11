import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import TicketComments from './TicketComments';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTicketDetails();
    }
  }, [id, user, authLoading]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketById(id);
      setTicket(data);
    } catch (err) {
      console.error(err);
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
      setTicket(prev => ({ ...prev, status: newStatus }));
      alert(`Status successfully updated to ${newStatus}`);
    } catch (err) {
      // CRITICAL: Display EXACT text from backend rejection
      const errorMessage = err.message || 'Unknown status update error';
      alert(`FAILED TO UPDATE STATUS: ${errorMessage}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    if (!newPriority || newPriority === ticket.priority) return;

    try {
      setUpdatingPriority(true);
      await ticketService.updateTicketPriority(id, newPriority);
      setTicket(prev => ({ ...prev, priority: newPriority }));
      alert(`Priority successfully updated to ${newPriority}`);
    } catch (err) {
      // CRITICAL: Display EXACT text from backend rejection
      const errorMessage = err.message || 'Unknown priority update error';
      alert(`FAILED TO UPDATE PRIORITY: ${errorMessage}`);
    } finally {
      setUpdatingPriority(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="ticket-detail-page" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!ticket) return <div className="ticket-detail-page"><h3>Ticket not found</h3></div>;

  return (
    <div className="ticket-detail-page">
      <div style={{ marginBottom: '2rem' }}>
        <button 
          className="btn-details" 
          onClick={() => navigate('..', { relative: 'path' })}
        >
          ← Back to Incident List
        </button>
      </div>

      <header className="detail-header">
        <div className="title-section">
          <h2>{ticket.title}</h2>
          <div className="status-row">
            <div className="status-select-container">
              <label>Status Management</label>
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

            <div className="status-select-container">
              <label>Urgency Level</label>
              <select 
                className="status-dropdown" 
                value={ticket.priority} 
                onChange={handlePriorityChange}
                disabled={updatingPriority}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="detail-grid">
        <div className="main-content">
          <section className="info-card">
            <h3>Issue Description</h3>
            <p className="description-text">{ticket.description}</p>
          </section>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <section className="info-card">
              <h3>Supporting Evidence</h3>
              <div className="attachments-grid">
                {ticket.attachments.map((url, idx) => (
                  <div key={idx} className="attachment-item">
                    <img src={url} alt="Incident Attachment" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="sidebar">
          <div className="info-card">
            <h3>Reference Details</h3>
            <ul className="meta-list">
              <li className="meta-row">
                <span className="meta-label">Incident ID</span>
                <span className="meta-value">#{ticket.id}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Category</span>
                <span className="meta-value">{ticket.category}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Incident Location</span>
                <span className="meta-value">{ticket.location}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Reported On</span>
                <span className="meta-value">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="section-divider">
        <TicketComments ticketId={id} currentUserId={user.id} />
      </div>
    </div>
  );
};

export default TicketDetail;
