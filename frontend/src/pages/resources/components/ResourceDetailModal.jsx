import React from 'react';
import './ResourceModal.css'; // Reuse modal styles

const ResourceDetailModal = ({ isOpen, onClose, resource }) => {
  if (!isOpen || !resource) return null;

  const { name, type, capacity, location, status, availabilityWindows } = resource;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Active & Available',
          class: 'status-active',
          desc: 'This resource is currently functioning and open for bookings.'
        };
      case 'OUT_OF_SERVICE':
        return {
          label: 'Out of Service',
          class: 'status-inactive',
          desc: 'This resource is currently unavailable due to maintenance or other issues.'
        };
      default:
        return {
          label: status,
          class: 'status-inactive',
          desc: 'Status information unavailable.'
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', width: '90%' }}>
        <div className="modal-header">
          <h2>Resource Information</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body" style={{ padding: '0 10px 10px 10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', alignItems: 'start' }}>
            {/* Left Column: Visual & Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '16px', 
                padding: '30px 20px', 
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '12px' }}>
                  {type === 'LECTURE_HALL' ? '🏛️' : type === 'LAB' ? '🔬' : type === 'MEETING_ROOM' ? '🤝' : '📦'}
                </div>
                <span className={`status-badge ${statusInfo.class}`} style={{ margin: '0 auto', display: 'inline-block' }}>
                  {statusInfo.label}
                </span>
              </div>
              
              <div style={{ 
                padding: '12px', 
                borderRadius: '12px', 
                backgroundColor: status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2',
                border: '1px solid',
                borderColor: status === 'ACTIVE' ? '#bbf7d0' : '#fecaca'
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: status === 'ACTIVE' ? '#166534' : '#991b1b', lineHeight: '1.4' }}>
                  {statusInfo.desc}
                </p>
              </div>
            </div>

            {/* Right Column: Details & Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.75rem', margin: '0 0 4px 0', color: '#0f172a' }}>{name}</h3>
                <p style={{ color: '#64748b', margin: 0, fontWeight: 500 }}>{type.replace('_', ' ')}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.025em' }}>Capacity</span>
                  <strong style={{ fontSize: '1rem', color: '#1e293b' }}>{capacity} People</strong>
                </div>
                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.025em' }}>Location</span>
                  <strong style={{ fontSize: '1rem', color: '#1e293b' }}>{location}</strong>
                </div>
              </div>

              {availabilityWindows && (
                <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#92400e', textTransform: 'uppercase' }}>Availability</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e' }}>{availabilityWindows}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ marginTop: '10px' }}>
          <button className="btn-secondary" onClick={onClose} style={{ width: '100%', padding: '12px' }}>Close Information</button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal;
