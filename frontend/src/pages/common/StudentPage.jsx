import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function StudentPage() {
  const { user, logout } = useAuth();

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.avatar}>
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="avatar" style={styles.avatarImg} />
            ) : (
              <span style={styles.avatarInitial}>
                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
              </span>
            )}
          </div>
          <div>
            <h1 style={styles.greeting}>Welcome, {user?.name || 'Student'}</h1>
            <p style={styles.subheading}>Smart Campus Student Portal</p>
            <span style={styles.roleBadge}>STUDENT</span>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={logout}>
          Sign Out
        </button>
      </div>

      {/* Info card */}
      <div style={styles.infoCard}>
        <span style={styles.infoIcon}>ℹ️</span>
        <div>
          <strong style={styles.infoTitle}>Limited Access Account</strong>
          <p style={styles.infoText}>
            Your account is active with student-level access. You can browse campus resources and submit maintenance tickets.
            Contact an administrator if you need elevated permissions.
          </p>
        </div>
      </div>

      {/* Action cards */}
      <div style={styles.grid}>
        <Link to="/staff/facilities" style={styles.card}>
          <div style={styles.cardIcon}>🏛️</div>
          <h3 style={styles.cardTitle}>Resource Catalogue</h3>
          <p style={styles.cardDesc}>Browse available lecture halls, labs, meeting rooms, and equipment.</p>
          <span style={styles.cardArrow}>→</span>
        </Link>

        <Link to="/staff/tickets" style={styles.card}>
          <div style={styles.cardIcon}>🎫</div>
          <h3 style={styles.cardTitle}>Report an Issue</h3>
          <p style={styles.cardDesc}>Submit a maintenance ticket for any campus facility problem.</p>
          <span style={styles.cardArrow}>→</span>
        </Link>

        <Link to="/profile" style={styles.card}>
          <div style={styles.cardIcon}>👤</div>
          <h3 style={styles.cardTitle}>My Profile</h3>
          <p style={styles.cardDesc}>View and update your name, contact information, and department.</p>
          <span style={styles.cardArrow}>→</span>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '2.5rem',
    fontFamily: "'Inter', sans-serif",
    color: '#f1f5f9',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '16px',
    padding: '1.5rem 2rem',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarInitial: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#fff',
  },
  greeting: {
    fontSize: '1.4rem',
    fontWeight: 700,
    margin: 0,
    color: '#f1f5f9',
  },
  subheading: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    margin: '2px 0 6px',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    background: 'rgba(99,102,241,0.2)',
    color: '#818cf8',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    border: '1px solid rgba(99,102,241,0.3)',
  },
  logoutBtn: {
    padding: '10px 20px',
    background: 'rgba(239,68,68,0.1)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  infoCard: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    background: 'rgba(234,179,8,0.05)',
    border: '1px solid rgba(234,179,8,0.2)',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    marginBottom: '2rem',
  },
  infoIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
    marginTop: '2px',
  },
  infoTitle: {
    display: 'block',
    color: '#fde047',
    fontSize: '0.9rem',
    marginBottom: '4px',
  },
  infoText: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    margin: 0,
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    display: 'block',
    textDecoration: 'none',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.75rem',
    transition: 'all 0.25s',
    position: 'relative',
    overflow: 'hidden',
  },
  cardIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#f1f5f9',
    margin: '0 0 8px',
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    margin: '0 0 1rem',
  },
  cardArrow: {
    color: '#6366f1',
    fontSize: '1.1rem',
    fontWeight: 700,
  },
};

export default StudentPage;
