import { useAuth } from "./context/AuthContext";

// Import Ticketing Components
import TicketList from "./components/tickets/TicketList";
import TicketForm from "./components/tickets/TicketForm";
import TicketDetail from "./components/tickets/TicketDetail";

// Import other pages
import ResourceListPage from "./pages/resources/ResourceListPage";

function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#0f0f13", color: "white" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ padding: "0 1rem", minHeight: "100vh", backgroundColor: "#0f0f13", color: "white", fontFamily: "'Inter', sans-serif" }}>
        <nav style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "1.5rem 2rem", 
          background: "rgba(255,255,255,0.03)", 
          backdropFilter: "blur(10px)",
          borderRadius: "0 0 20px 20px",
          marginBottom: "2rem",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
            Smart<span style={{ color: "#6c5ce7" }}>Campus</span>
          </Link>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {user && (
              <>
                <Link to="/resources" style={{ color: "#d1d1d1", textDecoration: "none", fontWeight: "500", transition: "color 0.2s" }}>Catalogue</Link>
                <Link to="/maintenance" style={{ color: "#d1d1d1", textDecoration: "none", fontWeight: "500", transition: "color 0.2s" }}>Maintenance</Link>
              </>
            )}
            {!user ? (
              <button onClick={login} style={{ 
                padding: "10px 20px", 
                borderRadius: "10px", 
                border: "none", 
                background: "#6c5ce7", 
                color: "white", 
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(108, 92, 231, 0.3)"
              }}>Login</button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "0.9rem", color: "#a0a0a0" }}>{user.name}</span>
                <button onClick={logout} style={{ 
                  padding: "8px 16px", 
                  borderRadius: "8px", 
                  border: "1px solid #ff4757", 
                  background: "transparent", 
                  color: "#ff4757", 
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}>Logout</button>
              </div>
            )}
          </div>
        </nav>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <Routes>
            <Route path="/" element={
              <div style={{ textAlign: "center", marginTop: "100px" }}>
                <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", fontWeight: "800" }}>Welcome to Smart Campus</h1>
                <p style={{ fontSize: "1.2rem", color: "#a0a0a0", marginBottom: "2.5rem" }}>
                  The unified platform for resource management and maintenance.
                </p>
                {user ? (
                  <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                    <Link to="/resources">
                      <button style={{ padding: "14px 28px", fontSize: "1.1rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #6c5ce7, #a29bfe)", color: "white", fontWeight: "600", cursor: "pointer" }}>View Catalogue</button>
                    </Link>
                    <Link to="/maintenance">
                      <button style={{ padding: "14px 28px", fontSize: "1.1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontWeight: "600", cursor: "pointer" }}>Ticketing System</button>
                    </Link>
                  </div>
                ) : (
                  <button onClick={login} style={{ padding: "14px 28px", fontSize: "1.1rem", borderRadius: "12px", border: "none", background: "#6c5ce7", color: "white", fontWeight: "600", cursor: "pointer" }}>Login to Get Started</button>
                )}
              </div>
            } />
            
            {/* Maintenance Routes */}
            <Route path="/maintenance" element={<TicketList />} />
            <Route path="/maintenance/new" element={<TicketForm />} />
            <Route path="/maintenance/:id" element={<TicketDetail />} />

            {/* Other Routes */}
            <Route path="/resources" element={<ResourceListPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;