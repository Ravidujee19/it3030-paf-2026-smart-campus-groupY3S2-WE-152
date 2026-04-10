import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import './BookingManagementPage.css';

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings(filterStatus);
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this booking?')) {
      try {
        await bookingService.reviewBooking(id, 'APPROVED', '');
        fetchBookings();
      } catch (err) {
        alert('Failed to approve booking.');
      }
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    try {
      await bookingService.reviewBooking(selectedBooking.id, 'REJECTED', rejectReason);
      setIsRejectModalOpen(false);
      fetchBookings();
    } catch (err) {
      alert('Failed to reject booking.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="admin-bookings-page">
      <div className="admin-bookings-header">
        <h1>Booking Management</h1>
        <p>Review and process facility access requests for the campus.</p>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          <label>Filter by status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Reservations</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="CONFIRMED">Confirmed Arrival</option>
            <option value="REJECTED">Declined</option>
            <option value="CANCELLED">User Cancelled</option>
          </select>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>
          Showing {bookings.length} requests
        </div>
      </div>

      <div className="admin-bookings-table-container">
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
            <div className="loading-spinner"></div>
            Syncing database records...
          </div>
        ) : (
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>Resource / Facility</th>
                <th>Requestor</th>
                <th>Scheduled Window</th>
                <th>Utilization Purpose</th>
                <th>Status</th>
                <th>Administrative Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{booking.resourceName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>#{booking.id.toString().padStart(6, '0')}</div>
                    </td>
                    <td>
                      <div className="user-identity">
                        <div className="user-avatar-circle">
                          {booking.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-identity-name">{booking.userName}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{formatDate(booking.startTime)}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                        {formatTime(booking.startTime)} — {formatTime(booking.endTime)}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '240px', fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }} title={booking.purpose}>
                        {booking.purpose ? (booking.purpose.length > 60 ? booking.purpose.substring(0, 60) + '...' : booking.purpose) : 'No specific details provided'}
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {booking.status === 'PENDING' ? (
                        <div className="admin-action-btns">
                          <button className="admin-btn approve-btn" onClick={() => handleApprove(booking.id)}>
                            Approve
                          </button>
                          <button className="admin-btn reject-btn" onClick={() => openRejectModal(booking)}>
                            Decline
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          Processed
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '100px 40px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Clear Queue</div>
                    No booking requests match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isRejectModalOpen && (
        <div className="reject-modal-overlay">
          <div className="reject-modal-content">
            <h2 style={{ marginBottom: '12px', color: '#0f172a', fontWeight: 800 }}>Reject Access Request</h2>
            <p style={{ marginBottom: '24px', fontSize: '0.925rem', color: '#64748b', lineHeight: 1.5 }}>
              You are declining the request for <strong>{selectedBooking?.resourceName}</strong>. Please provide a formal reason for the user.
            </p>
            
            <div className="admin-filter-group" style={{ maxWidth: 'none', marginBottom: '32px' }}>
              <label htmlFor="rejectReason">Formal Reason for Rejection</label>
              <textarea
                id="rejectReason"
                style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  minHeight: '140px',
                  outline: 'none',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  width: '100%',
                  fontFamily: 'inherit',
                  color: '#1e293b'
                }}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Facility unavailable due to scheduled maintenance or priority event."
                autoFocus
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button 
                className="admin-btn" 
                style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }} 
                onClick={() => setIsRejectModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="admin-btn" 
                style={{ background: '#ef4444', color: 'white' }}
                onClick={handleRejectSubmit}
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagementPage;
