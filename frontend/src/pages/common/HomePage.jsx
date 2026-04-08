import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/landing.css";

const Icons = {
  Facilities: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  ),
  Bookings: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  Maintenance: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
};

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'ADMIN') {
      navigate('/admin');
    } else if (user.role === 'STAFF') {
      navigate('/staff');
    } else if (user.role === 'TECHNICIAN') {
      navigate('/technician');
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="landing-layout">
      {/* Navigation */}
      <nav className="landing-navbar">
        <Link to="/home" className="landing-logo">
          <div className="landing-logo-icon">S</div>
          <span>Smart Campus</span>
        </Link>
        <div className="landing-nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Hello, {user.name}</span>
              <button onClick={handleDashboardRedirect} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>
                Dashboard
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 24px', borderRadius: '8px' }}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>
            The Operating System for your <span>Smart Campus</span>
          </h1>
          <p>
            An integrated platform to seamlessly manage facilities, automate resource bookings, handle maintenance workflows, and keep your entire campus connected in real-time.
          </p>
          <div className="home-action-buttons">
            {user ? (
              <button onClick={handleDashboardRedirect} className="btn-primary btn-large">
                Go to My Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-primary btn-large" style={{ textDecoration: 'none' }}>
                  Get Started
                </Link>
                <a href="#features" className="btn-secondary btn-large" style={{ textDecoration: 'none', background: 'white', color: '#0f172a', border: '1px solid #cbd5e1' }}>
                  Explore Features
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="home-features">
        <h2>Everything you need to run your campus</h2>
        <div className="features-grid">
          
          <div className="feature-card">
            <div className="feature-icon"><Icons.Facilities /></div>
            <h3>Facilities & Assets</h3>
            <p>Maintain a real-time registry of all campus resources. Monitor availability, manage capacities, and ensure optimal utilization of spaces and equipment.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Icons.Bookings /></div>
            <h3>Smart Bookings</h3>
            <p>Empower staff to easily book rooms and equipment. Conflict-free scheduling with automated approvals and instant confirmation systems.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Icons.Maintenance /></div>
            <h3>Predictive Maintenance</h3>
            <p>Log issues and track repair tickets from creation to resolution. Assign technicians dynamically to resolve problems before they disrupt operations.</p>
          </div>

        </div>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} Smart Campus Metricon. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;