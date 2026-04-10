import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner} />
        <p style={styles.text}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#0f172a",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(99,102,241,0.2)",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: {
    color: "#94a3b8",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
  },
};

export default RoleRoute;