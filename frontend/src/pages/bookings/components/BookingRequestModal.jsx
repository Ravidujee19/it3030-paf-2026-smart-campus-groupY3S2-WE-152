import React, { useState } from 'react';
import bookingService from '../../../services/bookingService';
import './BookingRequestModal.css';

const BookingRequestModal = ({ isOpen, onClose, resource, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '09:00',
    endTime: '11:00',
    purpose: '',
    expectedAttendees: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !resource) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Combine date and time for backend LocalDateTime
      const start = `${formData.date}T${formData.startTime}:00`;
      const end = `${formData.date}T${formData.endTime}:00`;

      const bookingData = {
        resourceId: resource.id,
        startTime: start,
        endTime: end,
        purpose: formData.purpose,
        expectedAttendees: parseInt(formData.expectedAttendees, 10) || 0,
      };

      await bookingService.requestBooking(bookingData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        date: '',
        startTime: '09:00',
        endTime: '11:00',
        purpose: '',
        expectedAttendees: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request booking. Please check for scheduling conflicts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2>Request Booking</h2>
          <button className="booking-btn-secondary" style={{ padding: '8px', minWidth: 'auto' }} onClick={onClose}>&times;</button>
        </div>

        <div className="resource-selection-info">
          <span className="res-icon">🏛️</span>
          <div>
            <span className="res-name">{resource.name}</span>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{resource.location}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {error && <div className="booking-error">{error}</div>}

          <div className="booking-form-group">
            <label htmlFor="date">Booking Date</label>
            <input
              type="date"
              id="date"
              name="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="booking-form-row">
            <div className="booking-form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="booking-form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="booking-form-group">
            <label htmlFor="expectedAttendees">Expected Attendees</label>
            <input
              type="number"
              id="expectedAttendees"
              name="expectedAttendees"
              required
              min="1"
              max={resource.capacity}
              placeholder={`Max: ${resource.capacity}`}
              value={formData.expectedAttendees}
              onChange={handleChange}
            />
          </div>

          <div className="booking-form-group">
            <label htmlFor="purpose">Purpose</label>
            <textarea
              id="purpose"
              name="purpose"
              required
              placeholder="Describe the reason for this booking"
              rows="3"
              value={formData.purpose}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="booking-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" className="booking-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="booking-btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingRequestModal;
