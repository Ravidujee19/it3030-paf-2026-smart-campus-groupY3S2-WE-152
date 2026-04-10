import { useAuth } from '../../context/AuthContext';
import ResourceListPage from '../resources/ResourceListPage';
import studentHero from '../../assets/student-hero.png';
import './StaffDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="staff-dashboard">
      <div className="dashboard-top-grid" style={{ marginBottom: '24px' }}>
        {/* Hero Section */}
        <header 
          className="dashboard-hero" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.7)), url(${studentHero})`,
            margin: 0,
            borderRadius: '20px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '280px'
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
