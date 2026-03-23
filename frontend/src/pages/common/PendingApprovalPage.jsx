import { useAuth } from "../../context/AuthContext";

function PendingApprovalPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Account Pending Approval</h1>
      <p>Your account has been created successfully.</p>
      <p>Please wait until an admin approves your access.</p>

      <br />

      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Current Role:</strong> {user?.role}</p>

      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default PendingApprovalPage;