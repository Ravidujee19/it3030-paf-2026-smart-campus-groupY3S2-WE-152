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
        <h1>Booking Requests</h1>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-group">
          <label>Status Filter</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="admin-bookings-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Requestor</th>
                <th>Date & Time</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{booking.resourceName}</div>
                    </td>
                    <td>
                      <div className="user-identity">
                        <span className="user-identity-name">{booking.userName}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{formatDate(booking.startTime)}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px', fontSize: '0.875rem' }} title={booking.purpose}>
                        {booking.purpose.length > 50 ? booking.purpose.substring(0, 50) + '...' : booking.purpose}
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
                          <button className="approve-btn" onClick={() => handleApprove(booking.id)}>Approve</button>
                          <button className="reject-btn" onClick={() => openRejectModal(booking)}>Reject</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No booking requests found.
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
            <h2 style={{ marginBottom: '16px', color: '#1e293b' }}>Reject Request</h2>
            <p style={{ marginBottom: '8px', fontSize: '0.875rem', color: '#64748b' }}>
              Resource: <strong>{selectedBooking?.resourceName}</strong>
            </p>
            <div className="admin-filter-group" style={{ marginBottom: '24px' }}>
              <label>Rejection Reason (Required)</label>
              <textarea
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0', 
                  background: '#f8fafc', 
                  minHeight: '100px',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: The requested resource is scheduled for maintenance."
              ></textarea>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="approve-btn" style={{ background: '#f1f5f9', color: '#475569' }} onClick={() => setIsRejectModalOpen(false)}>Cancel</button>
              <button className="reject-btn" onClick={handleRejectSubmit}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagementPage;
