import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import BookingRequestModal from '../../bookings/components/BookingRequestModal';
import ResourceDetailModal from './ResourceDetailModal';
import './ResourceCard.css';

// Import category-specific images
import lectureHallImg from '../../../assets/resources/lecture-hall.png';
import labImg from '../../../assets/resources/lab.png';
import meetingRoomImg from '../../../assets/resources/meeting-room.png';
import equipmentImg from '../../../assets/resources/equipment.png';

const TYPE_IMAGE_MAP = {
  'LECTURE_HALL': lectureHallImg,
  'LAB': labImg,
  'MEETING_ROOM': meetingRoomImg,
  'EQUIPMENT': equipmentImg
};

const ResourceCard = ({ resource, onDelete, onEdit, onBook, onViewDetails }) => {
  const { id, name, type, capacity, location, status } = resource;
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

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

  return (
    <div className="resource-card">
      <div className="resource-card-image-container">
        <img 
          src={TYPE_IMAGE_MAP[type] || lectureHallImg} 
          alt={name} 
          className="resource-card-image"
        />
        <div className="image-overlay">
          <span className={`status-badge-compact ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>
      </div>
      
      <div className="resource-card-header">
        <div className="header-left">
          <span className="resource-icon">{getTypeIcon(type)}</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--admin-text-light)' }}>
            {type.replace('_', ' ')}
          </span>
        </div>
        {isAdmin && (
          <div className="admin-actions">
            <button 
              className="edit-item-btn" 
              onClick={handleEditClick}
              title="Edit Resource"
            >
              ✏️
            </button>
            <button 
              className="delete-item-btn" 
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
        <p className="resource-type">{type.replace('_', ' ')}</p>
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
        {isStudent ? (
          <button 
            className="view-details-btn" 
            style={{ background: 'linear-gradient(135deg, #4b5563, #6b7280)' }}
            onClick={() => onViewDetails && onViewDetails(resource)}
          >
            View Details
          </button>
        ) : !isAdmin ? (
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button 
              className="view-details-btn" 
              style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', flex: 1 }}
              onClick={() => onViewDetails && onViewDetails(resource)}
            >
              Details
            </button>
            <button 
              className="view-details-btn" 
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', flex: 2 }}
              onClick={() => onBook && onBook(resource)}
            >
              Book Now
            </button>
          </div>
        ) : (
          <button className="view-details-btn" onClick={() => onViewDetails && onViewDetails(resource)}>
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
