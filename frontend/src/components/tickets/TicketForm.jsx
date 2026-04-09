import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createTicket, uploadAttachments } from '../../services/ticketService';
import './TicketForm.css';

const CATEGORIES = [
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'HVAC', label: 'HVAC / Air Conditioning' },
  { value: 'NETWORK', label: 'Network / Internet' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'OTHER', label: 'Other' },
];

const PRIORITIES = [
  { value: 'LOW', label: 'Low', color: '#10b981' },
  { value: 'MEDIUM', label: 'Medium', color: '#f59e0b' },
  { value: 'HIGH', label: 'High', color: '#f97316' },
  { value: 'CRITICAL', label: 'Critical', color: '#ef4444' },
];

const MAX_ATTACHMENTS = 3;

const TicketForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const currentUserId = user?.id || user?.userId || 1; // Fallback to 1
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    location: '',
    resourceName: '',
    contactEmail: '',
    contactPhone: '',
    createdByUserId: currentUserId,
  });

  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      setError(`You can upload a maximum of ${MAX_ATTACHMENTS} images.`);
      return;
    }

    // Validate file types (images only)
    const invalidFiles = files.filter((f) => !f.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Only image files are allowed.');
      return;
    }

    setError(null);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create the ticket
      const createdTicket = await createTicket(formData);

      // Step 2: Upload attachments if any were selected
      if (attachments.length > 0 && createdTicket.id) {
        try {
          await uploadAttachments(createdTicket.id, attachments, formData.createdByUserId);
        } catch (uploadErr) {
          console.warn('Ticket created but attachment upload failed:', uploadErr);
          // Don't fail the whole submission — ticket was already created
        }
      }

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: '',
        location: '',
        resourceName: '',
        contactEmail: '',
        contactPhone: '',
        createdByUserId: currentUserId,
      });
      setAttachments([]);

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create ticket. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="ticket-form-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Ticket Submitted!</h2>
          <p>Your maintenance request has been created successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-form-container">
      <div className="ticket-form-card">
        <div className="form-header">
          <h2>Report an Incident</h2>
          <p>Fill in the details below to submit a maintenance or incident ticket.</p>
        </div>

        {error && (
          <div className="form-error">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="ticket-form">
          {/* Title */}
          <div className="form-group full-width">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Brief summary of the issue"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category & Priority — side by side */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select priority</option>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location & Resource Name */}
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g., Building A, Lab 3"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="resourceName">Resource / Asset Name</label>
            <input
              type="text"
              id="resourceName"
              name="resourceName"
              placeholder="e.g., AC Unit #12"
              value={formData.resourceName}
              onChange={handleChange}
            />
          </div>

          {/* Description — full width */}
          <div className="form-group full-width">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Provide a detailed description of the issue..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact Info */}
          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              placeholder="your@email.com"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactPhone">Contact Phone</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              placeholder="077-123-4567"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>

          {/* File Attachments */}
          <div className="form-group full-width">
            <label>Attachments (max {MAX_ATTACHMENTS} images)</label>
            <div className="attachment-area">
              {attachments.length < MAX_ATTACHMENTS && (
                <label className="file-upload-btn" htmlFor="file-input">
                  <span className="upload-icon">📎</span>
                  <span>Choose Images</span>
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}

              {attachments.length > 0 && (
                <div className="attachment-list">
                  {attachments.map((file, index) => (
                    <div key={index} className="attachment-chip">
                      <span className="chip-name">{file.name}</span>
                      <button
                        type="button"
                        className="chip-remove"
                        onClick={() => removeAttachment(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions full-width">
            {onCancel && (
              <button type="button" className="btn-cancel" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Submitting...
                </>
              ) : (
                'Submit Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
