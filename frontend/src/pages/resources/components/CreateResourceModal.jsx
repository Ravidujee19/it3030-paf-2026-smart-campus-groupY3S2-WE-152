import React, { useState } from 'react';
import resourceService from '../../../services/resourceService';
import './CreateResourceModal.css';

const CreateResourceModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    status: 'ACTIVE',
    availabilityWindows: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
      };
      await resourceService.createResource(data);
      onSuccess();
      onClose();
      setFormData({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        status: 'ACTIVE',
        availabilityWindows: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create resource. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Resource</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="resource-form">
          {error && <div className="form-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Resource Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g. Auditorium A"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Resource Type</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange}>
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Lab</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                required
                min="1"
                placeholder="Min 1"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              required
              placeholder="Building/Room number"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Initial Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="availabilityWindows">Availability Windows</label>
            <textarea
              id="availabilityWindows"
              name="availabilityWindows"
              placeholder="e.g. 08:00 AM - 08:00 PM"
              value={formData.availabilityWindows}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResourceModal;
