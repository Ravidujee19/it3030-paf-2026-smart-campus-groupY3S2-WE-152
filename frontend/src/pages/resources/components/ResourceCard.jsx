import React from 'react';
import './ResourceCard.css';

const ResourceCard = ({ resource }) => {
  const { name, type, capacity, location, status } = resource;

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

  return (
    <div className="resource-card">
      <div className="resource-card-header">
        <span className="resource-icon">{getTypeIcon(type)}</span>
        <span className={`status-badge ${getStatusClass(status)}`}>
          {status}
        </span>
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
