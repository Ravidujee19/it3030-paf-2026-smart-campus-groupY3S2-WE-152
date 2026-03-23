import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Smart Campus</h1>

      {!user ? (
        <>
          <p>You are not logged in</p>
          <button onClick={login}>Login with Google</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default App;