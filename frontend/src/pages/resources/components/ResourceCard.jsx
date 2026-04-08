import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import BookingRequestModal from '../../bookings/components/BookingRequestModal';
import './ResourceCard.css';

const ResourceCard = ({ resource, onDelete, onEdit }) => {
  const { id, name, type, capacity, location, status } = resource;
  const { user } = useAuth();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const isAdmin = user?.role === 'ADMIN';

  const getStatusClass = (status) => {
    return status === 'ACTIVE' ? 'status-active' : 'status-inactive';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'LECTURE_HALL': return '🏛️';
      case 'LAB': return '🔬';
      case 'MEETING_ROOM': return '🤝';
      case 'EQUIPMENT': return '📸';
      default: return '📦';
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit();
  };

  const handleBookingSuccess = () => {
    alert('Booking request submitted successfully! An administrator will review it shortly.');
  };

  return (
    <div className="resource-card">
      <div className="resource-card-header">
        <div className="header-left">
          <div className="resource-icon-wrapper">
             {getTypeIcon(type)}
          </div>
          <span className={`status-badge ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>
        {isAdmin && (
          <div className="admin-actions">
            <button 
              className="action-btn edit-item-btn" 
              onClick={handleEditClick}
              title="Edit Resource"
            >
              ✏️
            </button>
            <button 
              className="action-btn delete-item-btn" 
              onClick={handleDeleteClick}
              title="Delete Resource"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      <div className="resource-card-body">
        <h3 className="resource-name">{name}</h3>
        <p className="resource-type">{type.replace(/_/g, ' ')}</p>
        <div className="resource-details">
          <div className="detail-item">
            <span className="detail-icon">👥</span>
            <span>Capacity: {capacity}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <span>{location}</span>
          </div>
        </div>
      </div>
      <div className="resource-card-footer">
        {!isAdmin ? (
          <button 
            className="view-details-btn book-now-btn" 
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book Now
          </button>
        ) : (
          <button className="view-details-btn">View Details</button>
        )}
      </div>

      <BookingRequestModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        resource={resource}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default ResourceCard;
