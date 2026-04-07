import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import QrCodeModal from './components/QrCodeModal';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQrBooking, setSelectedQrBooking] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId, resourceName) => {
    if (window.confirm(`Are you sure you want to cancel your booking for "${resourceName}"?`)) {
      try {
        await bookingService.cancelBooking(bookingId);
        fetchMyBookings(); // Refresh list
      } catch (err) {
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-approved';
      case 'CONFIRMED': return 'status-confirmed';
      case 'REJECTED': return 'status-rejected';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="page-loading">Loading your bookings...</div>;

  return (
    <div className="my-bookings-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Keep track of your resource requests and campus activities.</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="bookings-list">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="resource-mini-icon">🏛️</div>
              
              <div className="booking-main-info">
                <h3>{booking.resourceName}</h3>
                <div className="booking-meta">
                  <span className="meta-item">📅 {formatDate(booking.startTime)}</span>
                  <span className="meta-item">⏰ {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                </div>
                <div className="booking-purpose" style={{ marginTop: '8px', fontSize: '0.9rem', color: '#475569' }}>
                  <strong>Purpose:</strong> {booking.purpose}
                </div>
                {booking.status === 'REJECTED' && booking.rejectReason && (
                  <div className="reject-reason-box">
                    <strong>Admin Reason:</strong> {booking.rejectReason}
                  </div>
                )}
              </div>

              <div className="booking-status-container">
                <span className={`status-pill ${getStatusClass(booking.status)}`}>
                  {booking.status}
                </span>
                
                {booking.checkedIn && (
                  <span className="status-pill status-checked-in" style={{ 
                    background: '#e0f2fe', color: '#0369a1', marginLeft: '8px', 
                    fontWeight: 700, fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' 
                  }}>
                    ✓ CHECKED IN
                  </span>
                )}

                {(booking.status === 'APPROVED' || booking.status === 'CONFIRMED') && !booking.checkedIn && (
                  <button 
                    className="qr-btn"
                    onClick={() => {
                      setSelectedQrBooking(booking);
                      setIsQrModalOpen(true);
                    }}
                    style={{
                      background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0',
                      padding: '8px 16px', borderRadius: '8px', fontWeight: 600,
                      cursor: 'pointer', marginTop: '12px', display: 'flex', 
                      alignItems: 'center', gap: '8px', width: 'fit-content'
                    }}
                  >
                    🚀 Show QR Code
                  </button>
                )}
                {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                  <button 
                    className="cancel-btn" 
                    onClick={() => handleCancel(booking.id, booking.resourceName)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-bookings">
            <h3>You haven't requested any resources yet.</h3>
            <p>Visit the Catalogue to book your first resource.</p>
          </div>
        )}
      </div>

      <QrCodeModal 
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        booking={selectedQrBooking}
      />
    </div>
  );
};

export default MyBookingsPage;
