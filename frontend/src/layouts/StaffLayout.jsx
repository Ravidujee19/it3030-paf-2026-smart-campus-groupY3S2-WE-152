import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import AvatarCard from "../components/common/AvatarCard";
import "../styles/adminLayout.css"; 

const Icons = {
  Dashboard: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ),
  Facilities: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  ),
  Bookings: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  Logout: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
  ),
  Verify: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
  ),
  Notifications: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  )
};

export default function StaffLayout() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/staff", icon: <Icons.Dashboard /> },
    { name: "Facilities & Assets", path: "/staff/facilities", icon: <Icons.Facilities /> },
    { name: "My Bookings", path: "/staff/bookings", icon: <Icons.Bookings /> },
    { name: "Verify Check-in", path: "/staff/verify", icon: <Icons.Verify /> },
    { name: "Notifications", path: "/staff/notifications", icon: <Icons.Notifications /> },
  ];

  return (
    <div className="admin-layout">
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
        <header className="admin-header">
          <h2 className="admin-header-title">Staff Hub</h2>
          
          <div className="admin-header-user">
            {/* Notification Bell */}
            <Link to="/staff/notifications" className="admin-bell-btn" title="View Notifications" style={{ marginRight: '15px' }}>
              <Icons.Notifications />
              {unreadCount > 0 && <span className="admin-bell-badge">{unreadCount}</span>}
            </Link>

            <Link to="/staff/profile" className="admin-header-user-clickable" title="View Profile">
              <div className="user-name-wrapper">
                <span className="user-name-text">{user?.name || "Staff Member"}</span>
                <span className="user-role-text">{user?.role || "Staff"}</span>
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

        <div className="admin-scroll-area">
          <main className="admin-content">
            <Outlet />
          </main>

          <footer className="admin-footer">
            <div className="admin-footer-copy">
              &copy; {new Date().getFullYear()} Metricon Campus Management System. All rights reserved.
            </div>
            <div className="admin-footer-links">
              <Link to="/staff" className="admin-footer-link">Dashboard</Link>
              <Link to="/staff/profile" className="admin-footer-link">Profile</Link>
              <span className="admin-footer-link">v1.2.4-stable</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
