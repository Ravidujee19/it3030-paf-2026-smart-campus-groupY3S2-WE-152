import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ResourceListPage from '../resources/ResourceListPage';
import ProfileHeader from '../../components/common/ProfileHeader';
import studentHero from '../../assets/student-hero.png';
import './StaffDashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="staff-dashboard">
      <div className="dashboard-top-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left: Hero Section */}
        <header 
          className="dashboard-hero" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url(${studentHero})`,
            margin: 0,
            borderRadius: '20px',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="hero-content">
            <h1>Student Portal</h1>
            <p>Welcome, <strong>{user?.name || 'Student'}</strong>. Explore campus resources and check availability.</p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-label">Available Labs</span>
                <span className="stat-value">8</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Lecture Halls</span>
                <span className="stat-value">12</span>
              </div>
            </div>
          </div>
        </header>

        {/* Right: Quick Profile Section */}
        <section className="section-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <Link to="/profile" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
              Edit Profile
            </Link>
          </div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#64748b' }}>My Information</h2>
          <ProfileHeader user={user} />
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748b' }}>Account Status</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>● Active Account</span>
          </div>
          <button 
            onClick={logout}
            className="btn-secondary" 
            style={{ 
              marginTop: '15px', 
              width: '100%', 
              background: '#fef2f2', 
              color: '#dc2626', 
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <svg style={{width:'18px', height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6-10V7a3 3 0 01-6 0v1"></path>
            </svg>
            Log Out
          </button>
        </section>
      </div>

      <div className="dashboard-sections" style={{ display: 'block' }}>
        <section className="section-card">
          <h2><span style={{ marginRight: '8px' }}>🔍</span> Resource Catalogue</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Browse through available facilities. Click <strong>View Details</strong> to check current status and location.
          </p>
          <ResourceListPage hideHeader={true} />
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
