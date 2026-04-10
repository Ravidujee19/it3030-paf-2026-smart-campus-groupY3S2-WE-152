import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MotivationalQuotes from '../../components/staff/MotivationalQuotes';
import campusHero from '../../assets/campus-hero.png';
import quickActionsBg from '../../assets/quick-actions-bg.png';
import './StaffDashboard.css';

const StaffPage = () => {
  const { user } = useAuth();

  const Icons = {
    Catalogue: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    Booking: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    Ticket: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    Notification: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  };

  return (
    <div className="staff-dashboard">
      <header 
        className="dashboard-hero" 
        style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.7)), url(${campusHero})` }}
      >
        <div className="hero-content">
          <h1>Staff Hub</h1>
          <p>Welcome back, <strong>{user?.name || 'savinda thennakoon'}</strong>. Here's what's happening on campus today.</p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-label">Total Resources</span>
              <span className="stat-value">42</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Bookings</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Open Tickets</span>
              <span className="stat-value">5</span>
            </div>
          </div>
        </div>
      </header>

      <MotivationalQuotes />

      <div className="dashboard-sections">
        <section className="section-card quick-actions-container">
          <div className="quick-actions-main">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <Link to="/staff/facilities" className="action-btn">
                <div className="action-icon"><Icons.Catalogue /></div>
                <span>View Catalogue</span>
              </Link>
              <Link to="/staff/bookings" className="action-btn">
                <div className="action-icon"><Icons.Booking /></div>
                <span>My Bookings</span>
              </Link>
              <Link to="/staff/tickets" className="action-btn">
                <div className="action-icon"><Icons.Ticket /></div>
                <span>New Ticket</span>
              </Link>
              <Link to="/profile" className="action-btn">
                <div className="action-icon"><Icons.Notification /></div>
                <span>My Profile</span>
              </Link>
            </div>
          </div>
          <div 
            className="quick-actions-banner"
            style={{ backgroundImage: `url(${quickActionsBg})` }}
          />
        </section>

        <section className="section-card recent-updates">
          <h2>Campus Updates</h2>
          <div className="announcements-list">
            <div className="announcement-item">
              <span className="announcement-tag tag-new">New Facility</span>
              <h3>Auditorium 1 Refurbished</h3>
              <p>The main auditorium is now back online with upgraded AV equipment.</p>
            </div>
            <div className="announcement-item">
              <span className="announcement-tag tag-update">Update</span>
              <h3>Upcoming Maintenance</h3>
              <p>Lab B will be closed for routine maintenance this Saturday, April 11th.</p>
            </div>
            <div className="announcement-item">
              <span className="announcement-tag tag-update">Policy</span>
              <h3>New Booking Guidelines</h3>
              <p>Please review the updated resource booking policy effective immediately.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffPage;