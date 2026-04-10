import React, { useState, useEffect } from 'react';
import { getAllTickets } from '../../services/ticketService';
import './TicketList.css';

const STATUS_CONFIG = {
  OPEN: { label: 'Open', className: 'status-open' },
  IN_PROGRESS: { label: 'In Progress', className: 'status-in-progress' },
  RESOLVED: { label: 'Resolved', className: 'status-resolved' },
  CLOSED: { label: 'Closed', className: 'status-closed' },
  REJECTED: { label: 'Rejected', className: 'status-rejected' },
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', className: 'priority-low' },
  MEDIUM: { label: 'Medium', className: 'priority-medium' },
  HIGH: { label: 'High', className: 'priority-high' },
  CRITICAL: { label: 'Critical', className: 'priority-critical' },
};

const CATEGORY_ICONS = {
  ELECTRICAL: '⚡',
  PLUMBING: '🔧',
  HVAC: '❄️',
  NETWORK: '🌐',
  FURNITURE: '🪑',
  CLEANING: '🧹',
  SECURITY: '🔒',
  OTHER: '📋',
};

const TicketList = ({ onViewDetails, refreshTrigger }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, refreshTrigger]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getAllTickets(statusFilter || null);
      setTickets(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="ticket-list-container">
      {/* Header */}
      <div className="ticket-list-header">
        <div className="header-text">
          <h2>Maintenance Tickets</h2>
          <p>{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Status Filter */}
        <div className="filter-bar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter-select"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="ticket-loading">
          <div className="spinner"></div>
          <p>Loading tickets...</p>
        </div>
      ) : error ? (
        <div className="ticket-error">
          <p>{error}</p>
          <button onClick={fetchTickets} className="retry-btn">Retry</button>
        </div>
      ) : tickets.length === 0 ? (
        <div className="ticket-empty">
          <div className="empty-icon">🎫</div>
          <h3>No tickets found</h3>
          <p>There are no tickets matching your filter.</p>
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((ticket) => {
            const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OPEN;
            const priorityCfg = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.LOW;
            const categoryIcon = CATEGORY_ICONS[ticket.category] || '📋';

            return (
              <div key={ticket.id} className="ticket-card">
                {/* Card Top Row */}
                <div className="card-top">
                  <span className="ticket-id">#{ticket.id}</span>
                  <span className={`status-badge ${statusCfg.className}`}>
                    {statusCfg.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="ticket-title">{ticket.title}</h3>

                {/* Meta Info */}
                <div className="ticket-meta">
                  <div className="meta-item">
                    <span className="meta-icon">{categoryIcon}</span>
                    <span>{ticket.category}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span>{ticket.location}</span>
                  </div>
                </div>

                {/* Priority + Date Row */}
                <div className="card-bottom">
                  <span className={`priority-badge ${priorityCfg.className}`}>
                    {priorityCfg.label}
                  </span>
                  <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
                </div>

                {/* Stats Row */}
                <div className="card-stats">
                  <span className="stat-item" title="Comments">
                    💬 {ticket.commentCount || 0}
                  </span>
                  <span className="stat-item" title="Attachments">
                    📎 {ticket.attachmentCount || 0}
                  </span>
                </div>

                {/* View Details Button */}
                <button
                  className="btn-view-details"
                  onClick={() => onViewDetails && onViewDetails(ticket.id)}
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TicketList;
