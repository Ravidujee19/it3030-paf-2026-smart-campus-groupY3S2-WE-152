import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import './TicketList.css';

/**
 * Component to display a list of all maintenance tickets.
 */
const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getAllTickets();
        setTickets(data);
      } catch (err) {
        setError('Failed to load tickets. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="ticket-list-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-list-page">
        <div className="error-container">
          <p style={{ color: '#ff7675' }}>{error}</p>
          <button className="btn-details" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-list-page">
      <header className="list-header">
        <div>
          <h2>Maintenance Tickets</h2>
          <p style={{ color: '#636e72', marginTop: '5px' }}>Manage and track facility incidents</p>
        </div>
        <button 
          className="btn-create" 
          onClick={() => navigate('/maintenance/new')}
        >
          <span>+</span> Create New Ticket
        </button>
      </header>

      {tickets.length === 0 ? (
        <div className="empty-container">
          <p>No tickets found. Have a maintenance issue? Create one!</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="card-top">
                <span className="category-tag">{ticket.category}</span>
                <span className={getStatusClass(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="ticket-title">{ticket.title || 'Untitled Issue'}</h3>

              <div className="metadata-grid">
                <div className="meta-item">
                  <span className="meta-label">Location</span>
                  <span className="meta-value">{ticket.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Priority</span>
                  <span className={`meta-value ${getPriorityClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Created At</span>
                  <span className="meta-value">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">ID</span>
                  <span className="meta-value">#{ticket.id}</span>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  className="btn-details"
                  onClick={() => navigate(`/maintenance/${ticket.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
