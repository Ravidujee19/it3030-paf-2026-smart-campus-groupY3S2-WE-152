import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import './TicketForm.css';

/**
 * TicketForm component with RELATIVE ROUTING.
 */
const TicketForm = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
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

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactEmail: user.email || '',
        contactPhone: user.phone || ''
      }));
    }
  }, [user]);

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
    if (!user) {
      setError('You must be logged in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const finalData = { ...formData, createdByUserId: user.id };
      await ticketService.createTicket(finalData, images);
      
      // RELATIVE NAVIGATION ON SUCCESS
      navigate('..', { relative: 'path' }); 
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}><div className="spinner"></div></div>;
  }

  return (
    <div className="ticket-form-page" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="form-header">
        <h2 style={{ color: '#1e293b' }}>Report Maintenance Issue</h2>
        <p style={{ color: '#64748b' }}>Fill in the details below</p>
      </div>

      <div className="ticket-form-card" style={{ background: '#fff' }}>
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Ticket Summary</label>
              <input 
                type="text" 
                name="title" 
                placeholder="What needs fixing?"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={{ color: '#1e293b' }}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required style={{ color: '#1e293b' }}>
                <option value="">Select Category</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="HVAC">HVAC / AC</option>
                <option value="NETWORK">Network / Wifi</option>
                <option value="FURNITURE">Furniture</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange} required style={{ color: '#1e293b' }}>
                <option value="">Select Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                name="location" 
                placeholder="e.g. Block A, Lab 2"
                value={formData.location}
                onChange={handleInputChange}
                required
                style={{ color: '#1e293b' }}
              />
            </div>

            <div className="form-group">
              <label>Asset Name</label>
              <input 
                type="text" 
                name="resourceName" 
                placeholder="Optional"
                value={formData.resourceName}
                onChange={handleInputChange}
                style={{ color: '#1e293b' }}
              />
            </div>

            <div className="form-group full-width">
              <label>Detailed Description</label>
              <textarea 
                name="description" 
                placeholder="Please explain the issue..."
                value={formData.description}
                onChange={handleInputChange}
                required
                style={{ color: '#1e293b' }}
              />
            </div>

            <div className="form-group full-width">
              <label>Photos (Max 3)</label>
              <div 
                className="file-upload-section"
                onClick={() => fileInputRef.current.click()}
                style={{ border: '2px dashed #e2e8f0', background: '#f8fafc' }}
              >
                <span className="upload-icon">📸</span>
                <p style={{ color: '#64748b' }}>Click to upload</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple style={{ display: 'none' }} />
              </div>

              {images.length > 0 && (
                <div className="preview-grid">
                  {images.map((file, index) => (
                    <div key={index} className="preview-item">
                      <img src={URL.createObjectURL(file)} alt="preview" />
                      <button type="button" className="remove-file" onClick={() => removeImage(index)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('..', { relative: 'path' })} // RELATIVE CANCEL NAVIGATION
              disabled={loading}
              style={{ border: '1px solid #cbd5e1', color: '#64748b' }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
