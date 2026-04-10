import { useEffect, useState } from "react";
import API from "../../services/authService";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});

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

  const handleApproveOrUpdate = async (userId) => {
    try {
      await API.put(`/api/users/${userId}/role`, {
        role: selectedRoles[userId],
      });
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await API.delete(`/api/users/${userId}`);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin User Management</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Assign Role</th>
              <th>Approve / Update</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={selectedRoles[user.id] || user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="STAFF">STAFF</option>
                    <option value="TECHNICIAN">TECHNICIAN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleApproveOrUpdate(user.id)}>
                    {user.role === "PENDING" ? "Approve" : "Update"}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleReject(user.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;