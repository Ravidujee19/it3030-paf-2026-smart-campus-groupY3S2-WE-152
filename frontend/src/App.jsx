import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ResourceListPage from "./pages/resources/ResourceListPage";

function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      <div style={{ padding: "1rem", minHeight: "100vh", backgroundColor: "#0f0f13", color: "white" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold" }}>Smart Campus</Link>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {user && <Link to="/resources" style={{ color: "#a29bfe", textDecoration: "none", fontWeight: "500" }}>Catalogue</Link>}
            {!user ? (
              <button onClick={login} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#6c5ce7", color: "white", cursor: "pointer" }}>Login</button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "0.9rem", color: "#a0a0a0" }}>{user.name}</span>
                <button onClick={logout} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ff4757", background: "transparent", color: "#ff4757", cursor: "pointer" }}>Logout</button>
              </div>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <h1>Welcome to Smart Campus</h1>
              <p>Please {user ? "explore our catalogue" : "login to get started"}.</p>
              {user && <Link to="/resources"><button style={{ marginTop: "20px", padding: "12px 24px", fontSize: "1.1rem", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #6c5ce7, #a29bfe)", color: "white", cursor: "pointer" }}>Go to Catalogue</button></Link>}
            </div>
          } />
          <Route path="/resources" element={<ResourceListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;