import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/landing.css";

function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await login();
      setTimeout(() => setIsLoading(false), 5000);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError("Unable to connect to the authentication server. Please try again.");
    }
  };

  return (
    <div className="landing-layout">
      {/* Top Navbar space for consistency */}
      <nav className="landing-navbar">
        <Link to="/home" className="landing-logo">
          <div className="landing-logo-icon">S</div>
          <span>Smart Campus</span>
        </Link>
        <div className="landing-nav-actions">
          <Link to="/home" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', color: '#475569', fontSize: '0.95rem' }}>
            Explore Platform
          </Link>
        </div>
      </nav>

      <div className="login-container">
        {/* Soft blob backgrounds for visual depth */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="login-glass-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="landing-logo-icon" style={{ width: '56px', height: '56px', fontSize: '1.8rem' }}>S</div>
          </div>
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your Smart Campus Operations Hub</p>

          {error && <div className="login-error">{error}</div>}

          <button 
            className="btn-google" 
            onClick={handleLogin}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </div>
      
      <footer className="landing-footer">
        © {new Date().getFullYear()} Smart Campus Metricon. All rights reserved.
      </footer>
    </div>
  );
}

export default LoginPage;