import { useEffect, useState, useMemo } from "react";
import API from "../../services/authService";
import "../../styles/adminLayout.css";

const ROLE_CONFIG = {
  ADMIN: { label: "Admin", color: "#2563eb", bg: "rgba(37, 99, 235, 0.1)" },
  TECHNICIAN: { label: "Technician", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
  STAFF: { label: "Staff", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  STUDENT: { label: "Student", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  PENDING: { label: "Pending", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
};

function RoleBadge({ role }) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.PENDING;
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.color}33`,
        display: "inline-block",
        textTransform: "uppercase",
        letterSpacing: "0.02em"
      }}
    >
      {config.label}
    </span>
  );
}

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  const fetchUsers = async () => {
    try {
      const response = await API.get("/api/users");
      setUsers(response.data);

      const initialRoles = {};
      response.data.forEach((user) => {
        initialRoles[user.id] = user.role === "PENDING" ? "STUDENT" : user.role;
      });
      setSelectedRoles(initialRoles);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const handleApproveOrUpdate = async (user) => {
    try {
      await API.put(`/api/users/${user.id}/role`, {
        role: selectedRoles[user.id],
      });
      alert(`User ${user.name} role updated to ${selectedRoles[user.id]}`);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update role", error);
      alert("Failed to update user role.");
    }
  };

  const handleReject = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user ${user.name}? This cannot be undone.`)) {
      return;
    }
    try {
      await API.delete(`/api/users/${user.id}`);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterRole === "ALL" || user.role === filterRole;
      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterRole]);

  const stats = {
    total: users.length,
    pending: users.filter(u => u.role === "PENDING").length,
    approved: users.filter(u => u.role !== "PENDING").length,
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <div className="admin-spinner"></div>
        <p style={{ marginLeft: "12px", color: "var(--admin-text-light)" }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="admin-card-title" style={{ fontSize: "1.5rem", border: "none", margin: 0 }}>
          User Management
        </h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--admin-border)",
                backgroundColor: "#fff",
                fontSize: "0.9rem",
                width: "280px"
              }}
            />
          </div>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--admin-border)",
              backgroundColor: "#fff",
              fontSize: "0.9rem"
            }}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admins</option>
            <option value="TECHNICIAN">Technicians</option>
            <option value="STAFF">Staff</option>
            <option value="STUDENT">Students</option>
            <option value="PENDING">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="admin-grid" style={{ marginBottom: "24px", gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(37, 99, 235, 0.05)" }}>👥</div>
          <div className="stat-info">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(239, 68, 68, 0.05)", color: "#ef4444" }}>⏳</div>
          <div className="stat-info">
            <span className="stat-label">Pending Approval</span>
            <span className="stat-value" style={{ color: "#ef4444" }}>{stats.pending}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.05)", color: "#10b981" }}>✅</div>
          <div className="stat-info">
            <span className="stat-label">Verified Accounts</span>
            <span className="stat-value" style={{ color: "#10b981" }}>{stats.approved}</span>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>ID</th>
              <th>User Info</th>
              <th>Status</th>
              <th>Assign Role</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--admin-text-light)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🔍</div>
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--admin-text-light)" }}>#{user.id}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600, color: "var(--admin-text-dark)" }}>{user.name}</span>
                      <span style={{ fontSize: "0.85rem", color: "var(--admin-text-light)" }}>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <RoleBadge role={user.role} />
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      value={selectedRoles[user.id] || user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--admin-border)",
                        fontSize: "0.85rem"
                      }}
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="STAFF">STAFF</option>
                      <option value="TECHNICIAN">TECHNICIAN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button 
                        className={user.role === "PENDING" ? "btn-success" : "btn-primary"}
                        onClick={() => handleApproveOrUpdate(user)}
                        title={user.role === "PENDING" ? "Approve User" : "Update Role"}
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                      >
                        {user.role === "PENDING" ? "Approve" : "Update"}
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleReject(user)}
                        title="Delete User"
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;