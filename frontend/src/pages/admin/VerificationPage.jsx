import React, { useState } from 'react';
import bookingService from '../../services/bookingService';
import verifyHero from '../../assets/verify-hero.png';
import './VerificationPage.css';

const VerificationPage = () => {
    const [bookingId, setBookingId] = useState('');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        if (!bookingId) return;

        setLoading(true);
        setError(null);
        setSuccess(null);
        setBooking(null);

        try {
            // Remove BK- prefix if present
            const cleanId = bookingId.replace('BK-', '').replace(/^0+/, '');
            const data = await bookingService.getBookingById(cleanId);
            setBooking(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking not found. Please check the ID.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (!booking) return;
        setLoading(true);
        try {
            await bookingService.checkInBooking(booking.id);
            setSuccess(`Successfully checked in ${booking.userName} for ${booking.resourceName}!`);
            setBooking(null);
            setBookingId('');
        } catch (err) {
            setError(err.response?.data?.message || 'Check-in failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verification-page">
            <header 
                className="dashboard-hero" 
                style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7)), url(${verifyHero})` }}
            >
                <div className="hero-content">
                    <h1>Arrival Verification</h1>
                    <p>High-security scanning terminal for campus facility access and resource verification.</p>
                </div>
            </header>

            <div className="terminal-container">
                <div className="search-container">
                    <form onSubmit={handleVerify} className="search-form">
                        <div className="input-group">
                            <span className="input-prefix">#</span>
                            <input
                                type="text"
                                placeholder="Enter Booking ID (e.g. BK-00007)"
                                value={bookingId}
                                onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                                className="verify-input"
                            />
                        </div>
                        <button type="submit" disabled={loading || !bookingId} className="verify-btn">
                            {loading ? 'Searching...' : 'Search Record'}
                        </button>
                    </form>
                </div>

                {error && <div className="verification-error-card">{error}</div>}
                
                {success && (
                    <div className="verification-success-card">
                        <div className="success-icon">✓</div>
                        <div className="success-msg">{success}</div>
                    </div>
                )}

                {booking && (
                    <div className="booking-verification-card">
                        <div className="card-header">
                            <div className={`indicator ${booking.status.toLowerCase()}`}>{booking.status} RECORD</div>
                            <span className="booking-ref">#BK-{booking.id.toString().padStart(5, '0')}</span>
                        </div>

                        <div className="card-body">
                            <div className="user-section">
                                <div className="avatar">
                                    {booking.userName.charAt(0)}
                                </div>
                                <div className="user-details">
                                    <h3>{booking.userName}</h3>
                                    <p>Registered Student / Staff Member</p>
                                </div>
                            </div>

                            <div className="details-grid">
                                <div className="detail-item">
                                    <label>Facility</label>
                                    <p>{booking.resourceName}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Time Slot</label>
                                    <p>
                                        {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                        {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                                <div className="detail-item full-width">
                                    <label>Purpose</label>
                                    <p>{booking.purpose}</p>
                                </div>
                            </div>

                            {booking.checkedIn ? (
                                <div className="already-checked-in">
                                    <span className="checked-icon">✓</span>
                                    Verified Arrival at {new Date(booking.checkInTime).toLocaleTimeString()}
                                </div>
                            ) : (
                                <button onClick={handleCheckIn} disabled={loading} className="check-in-action-btn">
                                    {loading ? 'Processing...' : 'Confirm Arrival & Check In'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationPage;
