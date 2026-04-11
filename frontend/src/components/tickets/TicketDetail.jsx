import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import TicketComments from './TicketComments';
import './TicketDetail.css';

const API_BASE_URL = 'http://localhost:8081';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);
  
  // Edit form state
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    location: '',
    resourceName: '',
    contactEmail: '',
    contactPhone: ''
  });

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
      setEditData({
        title: data.title || '',
        description: data.description || '',
        location: data.location || '',
        resourceName: data.resourceName || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || ''
      });
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
      const errorMessage = err.message || 'Unknown priority update error';
      alert(`FAILED TO UPDATE PRIORITY: ${errorMessage}`);
    } finally {
      setUpdatingPriority(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await ticketService.updateTicket(id, editData);
      setTicket(response);
      setIsEditing(false);
      alert('Ticket details updated successfully!');
    } catch (err) {
      const errorMessage = err.message || 'Failed to update ticket';
      alert(`ERROR: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: ticket.title || '',
      description: ticket.description || '',
      location: ticket.location || '',
      resourceName: ticket.resourceName || '',
      contactEmail: ticket.contactEmail || '',
      contactPhone: ticket.contactPhone || ''
    });
    setIsEditing(false);
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
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <button 
          className="btn-details" 
          onClick={() => navigate('..', { relative: 'path' })}
        >
          ← Back to Incident List
        </button>
        {!isEditing && (
          <button 
            style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit Details
          </button>
        )}
      </div>

      <header className="detail-header">
        <div className="title-section">
          {isEditing ? (
            <input 
              type="text" 
              name="title" 
              value={editData.title}
              onChange={handleEditChange}
              style={{ fontSize: '1.75rem', fontWeight: '800', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' }}
            />
          ) : (
            <h2>{ticket.title}</h2>
          )}
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
            {isEditing ? (
              <textarea 
                name="description" 
                value={editData.description}
                onChange={handleEditChange}
                style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit' }}
              />
            ) : (
              <p className="description-text">{ticket.description}</p>
            )}
          </section>

          {isEditing && (
            <section className="info-card">
              <h3>Edit Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Resource Name</label>
                  <input 
                    type="text" 
                    name="resourceName" 
                    value={editData.resourceName}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={editData.location}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Contact Email</label>
                  <input 
                    type="email" 
                    name="contactEmail" 
                    value={editData.contactEmail}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Contact Phone</label>
                  <input 
                    type="tel" 
                    name="contactPhone" 
                    value={editData.contactPhone}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{ background: '#22c55e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  {isSaving ? 'Saving...' : '✓ Save'}
                </button>
                <button 
                  onClick={handleCancel}
                  disabled={isSaving}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  ✕ Cancel
                </button>
              </div>
            </section>
          )}

          {ticket.attachments && ticket.attachments.length > 0 && (
            <section className="info-card">
              <h3>Supporting Evidence</h3>
              <div className="attachments-grid">
                {ticket.attachments.map((attachment, idx) => (
                  <div key={idx} className="attachment-item">
                    <img src={`${API_BASE_URL}/${attachment.fileUrl}`} alt={attachment.fileName || "Incident Attachment"} />
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
                <span className="meta-label">Location</span>
                <span className="meta-value">{ticket.location || 'Not specified'}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Resource Name</span>
                <span className="meta-value">{ticket.resourceName || 'Not specified'}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Contact Email</span>
                <span className="meta-value">{ticket.contactEmail || 'Not specified'}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Contact Phone</span>
                <span className="meta-value">{ticket.contactPhone || 'Not specified'}</span>
              </li>
              <li className="meta-row">
                <span className="meta-label">Reported On</span>
                <span className="meta-value">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </li>
              {ticket.updatedAt && (
                <li className="meta-row">
                  <span className="meta-label">Last Updated</span>
                  <span className="meta-value">
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </span>
                </li>
              )}
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
