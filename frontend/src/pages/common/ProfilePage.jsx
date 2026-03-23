import { useAuth } from "../../context/AuthContext";

function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Profile</h1>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      {user?.profilePicture && (
        <img
          src={user.profilePicture}
          alt="Profile"
          style={{ width: "120px", borderRadius: "50%", marginTop: "1rem" }}
        />
      )}
      <br /><br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default ProfilePage;