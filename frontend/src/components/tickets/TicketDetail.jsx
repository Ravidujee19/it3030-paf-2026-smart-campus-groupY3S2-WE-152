import React, { useState, useEffect } from 'react';
import { getTicketById, updateTicketStatus, assignTechnician } from '../../services/ticketService';
import TicketComments from './TicketComments';
import './TicketDetail.css';

const STATUS_CONFIG = {
  OPEN: { label: 'Open', className: 'status-open', icon: '📋' },
  IN_PROGRESS: { label: 'In Progress', className: 'status-in-progress', icon: '⏳' },
  RESOLVED: { label: 'Resolved', className: 'status-resolved', icon: '✓' },
  CLOSED: { label: 'Closed', className: 'status-closed', icon: '✔' },
  REJECTED: { label: 'Rejected', className: 'status-rejected', icon: '✕' },
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', className: 'priority-low', icon: '▼' },
  MEDIUM: { label: 'Medium', className: 'priority-medium', icon: '■' },
  HIGH: { label: 'High', className: 'priority-high', icon: '▲' },
  CRITICAL: { label: 'Critical', className: 'priority-critical', icon: '🔴' },
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

const TicketDetail = ({ ticketId, onBack, currentUserId }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicketById(ticketId);
      setTicket(data);
    } catch (err) {
      setError('Failed to load ticket details. Please try again.');
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!ticket) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateTicketStatus(ticket.id, newStatus);
      setTicket(updated);
      setShowStatusMenu(false);
      setError(null);
    } catch (err) {
      setError('Failed to update ticket status. Please try again.');
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="ticket-detail-container">
        <div className="detail-loading">
          <div className="spinner"></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="ticket-detail-container">
        <button onClick={onBack} className="btn-back-detail">
          <span>←</span> Back
        </button>
        <div className="detail-error">
          <p>{error}</p>
          <button onClick={fetchTicketDetails} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-container">
        <button onClick={onBack} className="btn-back-detail">
          <span>←</span> Back
        </button>
        <div className="detail-error">
          <p>Ticket not found.</p>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OPEN;
  const priorityCfg = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.LOW;
  const categoryIcon = CATEGORY_ICONS[ticket.category] || '📋';

  return (
    <div className="ticket-detail-container">
      {/* Back Button */}
      <button onClick={onBack} className="btn-back-detail">
        <span>←</span> Back to Tickets
      </button>

      {/* Main Content Grid */}
      <div className="detail-grid">
        {/* Left Column: Ticket Details */}
        <div className="detail-column-main">
          {/* Header Card */}
          <div className="detail-header-card">
            <div className="header-top">
              <div>
                <h1 className="detail-title">{ticket.title}</h1>
                <p className="detail-subtitle">Ticket #{ticket.id}</p>
              </div>
              <div className="header-badges">
                <span className={`status-badge ${statusCfg.className}`}>
                  {statusCfg.icon} {statusCfg.label}
                </span>
                <span className={`priority-badge ${priorityCfg.className}`}>
                  {priorityCfg.icon} {priorityCfg.label}
                </span>
              </div>
            </div>
          </div>

          {/* Status Change Section */}
          <div className="detail-card">
            <div className="card-section-title">Status Management</div>
            <div className="status-menu-container">
              <button
                className="status-change-btn"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                disabled={updatingStatus}
              >
                Change Status
              </button>
              {showStatusMenu && (
                <div className="status-menu">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      className={`status-option ${key === ticket.status ? 'active' : ''}`}
                      onClick={() => handleStatusChange(key)}
                      disabled={updatingStatus}
                    >
                      {cfg.icon} {cfg.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Description Section */}
          <div className="detail-card">
            <div className="card-section-title">Description</div>
            <p className="description-text">{ticket.description}</p>
          </div>

          {/* Details Grid */}
          <div className="detail-card">
            <div className="card-section-title">Details</div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Category</span>
                <span className="detail-value">
                  {categoryIcon} {ticket.category}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">📍 {ticket.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Resource / Asset</span>
                <span className="detail-value">
                  {ticket.resourceName || '—'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created By</span>
                <span className="detail-value">{ticket.createdByName || 'User #' + ticket.createdByUserId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created Date</span>
                <span className="detail-value">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">{formatDate(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {(ticket.contactEmail || ticket.contactPhone) && (
            <div className="detail-card">
              <div className="card-section-title">Contact Information</div>
              <div className="contact-info">
                {ticket.contactEmail && (
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span>{ticket.contactEmail}</span>
                  </div>
                )}
                {ticket.contactPhone && (
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <span>{ticket.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="detail-card comments-card">
            <div className="card-section-title">Comments & Updates</div>
            <TicketComments
              ticketId={ticketId}
              currentUserId={currentUserId}
            />
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="detail-column-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Ticket Summary</h3>
            
            <div className="summary-section">
              <div className="summary-label">Priority</div>
              <span className={`priority-badge ${priorityCfg.className}`}>
                {priorityCfg.icon} {priorityCfg.label}
              </span>
            </div>

            <div className="summary-section">
              <div className="summary-label">Status</div>
              <span className={`status-badge ${statusCfg.className}`}>
                {statusCfg.icon} {statusCfg.label}
              </span>
            </div>

            <div className="summary-section">
              <div className="summary-label">Category</div>
              <span className="summary-text">{categoryIcon} {ticket.category}</span>
            </div>

            <div className="summary-section">
              <div className="summary-label">Submission Date</div>
              <span className="summary-text">{formatDate(ticket.createdAt)}</span>
            </div>

            {ticket.assignedToName && (
              <div className="summary-section">
                <div className="summary-label">Assigned To</div>
                <span className="summary-text">👨‍🔧 {ticket.assignedToName}</span>
              </div>
            )}

            <div className="summary-section">
              <div className="summary-label">Statistics</div>
              <div className="stats-list">
                <div className="stat-line">
                  <span>💬 Comments:</span>
                  <strong>{ticket.commentCount || 0}</strong>
                </div>
                <div className="stat-line">
                  <span>📎 Attachments:</span>
                  <strong>{ticket.attachmentCount || 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
