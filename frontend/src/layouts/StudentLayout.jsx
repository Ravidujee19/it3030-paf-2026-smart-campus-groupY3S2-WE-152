import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/adminLayout.css"; 

const Icons = {
  Dashboard: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Catalogue: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  Profile: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Logout: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
};

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/student", icon: <Icons.Dashboard /> },
    { name: "My Profile", path: "/student/profile", icon: <Icons.Profile /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo-area">
          <div className="admin-logo-icon">M</div>
          Metricon
        </div>
        
        <nav className="admin-nav-menu">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="admin-main-container">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-title">Student Portal</div>
          
          <div className="admin-header-user">
            <Link to="/student/profile" className="admin-header-user-clickable" title="View Profile">
              <div className="user-name-wrapper">
                <span className="user-name-text">{user?.name || "Student"}</span>
                <span className="user-role-text">{user?.role || "Student"}</span>
              </div>
              <div className="admin-avatar">
                {(user?.name || "S").charAt(0).toUpperCase()}
              </div>
            </Link>

            <button 
              onClick={handleLogout} 
              className="btn-danger logout-btn"
              style={{ padding: "8px 16px", display: "flex", gap: "6px", alignItems: "center" }}
            >
              <Icons.Logout />
              Logout
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="admin-scroll-area">
          <main className="admin-content">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="admin-footer">
            <div className="admin-footer-copy">
              &copy; {new Date().getFullYear()} Metricon Campus Management System. All rights reserved.
            </div>
            <div className="admin-footer-links">
              <Link to="/student" className="admin-footer-link">Dashboard</Link>
              <Link to="/student/profile" className="admin-footer-link">Profile</Link>
              <span className="admin-footer-link">v1.2.4-stable</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
