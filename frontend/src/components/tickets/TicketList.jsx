import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import './TicketList.css';

const API_BASE_URL = 'http://localhost:8081';

const TicketList = () => {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      fetchTickets();
    }
  }, [user, authLoading]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getAllTickets();
      console.log('Tickets loaded:', data); // Debug log
      console.log('First ticket attachments:', data[0]?.attachments); // Debug log
      setTickets(data);
    } catch (err) {
      // CRITICAL FIX: Detailed Error Logging
      const detailedMessage = err.message || 'Unknown fetching error';
      setError(detailedMessage);
      // Optional: alert the exact error if it's critical
      console.error('Fetch Error:', detailedMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId, ticketTitle) => {
    // Confirmation dialog
    if (!window.confirm(`Are you sure you want to delete the ticket "${ticketTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await ticketService.deleteTicket(ticketId);
      alert(`Ticket "${ticketTitle}" has been deleted successfully.`);
      // Refresh the ticket list
      setTickets(tickets.filter(t => t.id !== ticketId));
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete ticket';
      alert(`Error deleting ticket: ${errorMessage}`);
      console.error('Delete Error:', err);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = statusFilter === 'ALL' || ticket.status === statusFilter;
    const priorityMatch = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  if (authLoading || loading) {
    return <div className="ticket-list-page" style={{ textAlign: 'center', padding: '100px 0' }}><div className="spinner" /></div>;
  }

  if (error) {
    return (
      <div className="ticket-list-page">
        <div className="error-container">
          <p className="error-text">⚠️ {error}</p>
          <button className="btn-details" onClick={fetchTickets}>Retry Fetching</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-list-page">
      <header className="list-header">
        <div>
          <h2>Incident Catalogue</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '5px' }}>{filteredTickets.length} active maintenance requests found</p>
        </div>
        <button className="btn-create" onClick={() => navigate('new')}>+ Create New Ticket</button>
      </header>

      <div className="filter-bar" style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div className="filter-group">
          <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff' }}>
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Priority</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff' }}>
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <div className="tickets-grid">
        {filteredTickets.map((ticket) => {
          console.log(`Ticket ${ticket.id}:`, { attachments: ticket.attachments, attachmentCount: ticket.attachmentCount });
          return (
          <div key={ticket.id} className="ticket-card">
            {ticket.attachments && ticket.attachments.length > 0 && ticket.attachments[0]?.fileUrl ? (
              <div className="card-image">
                <img src={`${API_BASE_URL}/${ticket.attachments[0].fileUrl}`} alt={ticket.title} onError={(e) => {
                  console.error('Image failed to load:', ticket.attachments[0].fileUrl);
                  e.target.style.display = 'none';
                }} />
              </div>
            ) : (
              <div className="card-image" style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                {ticket.attachmentCount > 0 ? 'No image URL' : 'No attachments'}
              </div>
            )}
            
            <div className="card-top">
              <span className="category-tag">{ticket.category}</span>
              <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </div>
            
            <h3 className="ticket-title">{ticket.title}</h3>
            
            <div className="metadata-grid">
              <div className="meta-item">
                <span className="meta-label">Location</span>
                <span className="meta-value">{ticket.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Priority</span>
                <span className={`meta-value priority-${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>
            
            <div className="card-actions">
              <button 
                className="btn-details" 
                onClick={() => navigate(ticket.id.toString())}
              >
                View Details
              </button>
              <button 
                className="btn-delete" 
                onClick={() => handleDeleteTicket(ticket.id, ticket.title)}
              >
                Delete
              </button>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default TicketList;
