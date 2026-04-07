import React, { useState, useEffect } from 'react';
import resourceService from '../../../services/resourceService';
import './ResourceModal.css';

const ResourceModal = ({ isOpen, onClose, onSuccess, initialData = null, mode = 'CREATE' }) => {
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

  useEffect(() => {
    if (initialData && mode === 'EDIT') {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'LECTURE_HALL',
        capacity: initialData.capacity || '',
        location: initialData.location || '',
        status: initialData.status || 'ACTIVE',
        availabilityWindows: initialData.availabilityWindows || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        status: 'ACTIVE',
        availabilityWindows: '',
      });
    }
  }, [initialData, mode, isOpen]);

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

      if (mode === 'EDIT' && initialData?.id) {
        await resourceService.updateResource(initialData.id, data);
      } else {
        await resourceService.createResource(data);
      }

      onSuccess();
      onClose();
      if (mode === 'CREATE') {
        setFormData({
          name: '',
          type: 'LECTURE_HALL',
          capacity: '',
          location: '',
          status: 'ACTIVE',
          availabilityWindows: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${mode.toLowerCase()} resource. Please check your inputs.`);
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'EDIT' ? 'Update Resource' : 'Add New Resource';
  const buttonText = loading 
    ? (mode === 'EDIT' ? 'Updating...' : 'Creating...') 
    : (mode === 'EDIT' ? 'Update Resource' : 'Create Resource');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
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
            <label htmlFor="status">Status</label>
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
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceModal;
