import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "../components/notifications/NotificationDropdown";
import "../styles/adminLayout.css";

const Icons = {
  Dashboard: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M3 12l2-2 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2v10a1 1 0 01-1 1h-3" />
    </svg>
  ),
  Facilities: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
    </svg>
  ),
  Bookings: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" d="M8 7V3m8 4V3M5 21h14V7H5z" />
    </svg>
  ),
  Maintenance: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2"
        d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
  Notifications: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2"
        d="M15 17h5l-1-1V11a6 6 0 10-12 0v5l-1 1h5" />
    </svg>
  ),
  Users: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2"
        d="M5 20h14M12 12a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  ),
  Logout: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2"
        d="M17 16l4-4-4-4M7 12h14" />
    </svg>
  ),
  Verify: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2"
        d="M9 12l2 2 4-4" />
    </svg>
  )
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <Icons.Dashboard /> },
    { name: "Facilities & Assets", path: "/admin/facilities", icon: <Icons.Facilities /> },
    { name: "Booking Management", path: "/admin/bookings", icon: <Icons.Bookings /> },
    { name: "Verify Check-in", path: "/admin/verify", icon: <Icons.Verify /> },
    { name: "Maintenance", path: "/admin/maintenance", icon: <Icons.Maintenance /> },
    { name: "Notifications", path: "/admin/notifications", icon: <Icons.Notifications /> },
    { name: "Users", path: "/admin/users", icon: <Icons.Users /> },
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
            const isActive = location.pathname.startsWith(item.path);
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
          <h2 className="admin-header-title">Admin Hub</h2>

          <div className="admin-header-user">
            {/* Notifications */}
            <NotificationDropdown userRole="ADMIN" />

            {/* Profile */}
            <Link to="/admin/profile" className="admin-header-user-clickable">
              <div className="user-name-wrapper">
                <span>{user?.name || "Admin"}</span>
                <span className="user-role-text">Administrator</span>
              </div>
              <div className="admin-avatar">
                {(user?.name || "A")[0].toUpperCase()}
              </div>
            </Link>

            {/* Logout */}
            <button onClick={handleLogout} className="btn-danger logout-btn">
              <Icons.Logout />
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}