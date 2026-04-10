import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import './TicketForm.css';

/**
 * Component for creating a new maintenance ticket.
 */
const TicketForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: '',
    location: '',
    resourceName: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 3) {
      setError('You can only attach a maximum of 3 images.');
      return;
    }

    const newImages = [...images, ...files].slice(0, 3);
    setImages(newImages);
    setError(null);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await ticketService.createTicket(formData, images);
      // On success, navigate back to the list
      navigate('/maintenance');
    } catch (err) {
      setError('Failed to create ticket. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-form-page">
      <div className="form-header">
        <h2>Report an Incident</h2>
        <p style={{ color: '#a0a0a0' }}>Provide details about the maintenance issue</p>
      </div>

      <div className="ticket-form-card">
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Title - Essential for identifying the ticket */}
            <div className="form-group full-width">
              <label>Ticket Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g., Short circuit in Lab 302"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Select Category</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="HVAC">HVAC / AC</option>
                <option value="NETWORK">Network / Wifi</option>
                <option value="FURNITURE">Furniture</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div className="form-group">
              <label>Priority</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Select Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                name="location" 
                placeholder="e.g., Building B, Floor 2"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Resource Name */}
            <div className="form-group">
              <label>Resource / Asset Name</label>
              <input 
                type="text" 
                name="resourceName" 
                placeholder="e.g., Split AC Unit #12"
                value={formData.resourceName}
                onChange={handleInputChange}
              />
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label>Description</label>
              <textarea 
                name="description" 
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Contact Email */}
            <div className="form-group">
              <label>Contact Email</label>
              <input 
                type="email" 
                name="contactEmail" 
                placeholder="your@email.com"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Contact Phone */}
            <div className="form-group">
              <label>Contact Phone</label>
              <input 
                type="tel" 
                name="contactPhone" 
                placeholder="077-XXXXXXX"
                value={formData.contactPhone}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Image Attachments */}
            <div className="form-group full-width">
              <label>Attachments (Max 3 Images)</label>
              <div 
                className="file-upload-section"
                onClick={() => fileInputRef.current.click()}
              >
                <span className="upload-icon">📸</span>
                <p>Click to upload images</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*" 
                  multiple 
                  style={{ display: 'none' }}
                />
                <span className="file-hints">Supported: JPG, PNG, WEBP</span>
              </div>

              {images.length > 0 && (
                <div className="preview-grid">
                  {images.map((file, index) => (
                    <div key={index} className="preview-item">
                      <img src={URL.createObjectURL(file)} alt="preview" />
                      <button 
                        type="button" 
                        className="remove-file"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/maintenance')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Incident Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
