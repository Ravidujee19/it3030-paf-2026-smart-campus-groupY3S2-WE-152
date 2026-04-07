import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import './ResourceCard.css';

const ResourceCard = ({ resource, onDelete }) => {
  const { id, name, type, capacity, location, status } = resource;
  const { user } = useAuth();
  
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

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="resource-card">
      <div className="resource-card-header">
        <div className="header-left">
          <span className="resource-icon">{getTypeIcon(type)}</span>
          <span className={`status-badge ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>
        {isAdmin && (
          <button 
            className="delete-item-btn" 
            onClick={handleDeleteClick}
            title="Delete Resource"
          >
            🗑️
          </button>
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
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );
};

export default ResourceCard;
