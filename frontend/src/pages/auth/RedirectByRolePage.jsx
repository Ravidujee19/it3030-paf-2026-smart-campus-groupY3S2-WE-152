import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RedirectByRolePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin" replace />;
    case "TECHNICIAN":
      return <Navigate to="/technician" replace />;
    case "STAFF":
      return <Navigate to="/staff" replace />;
    case "STUDENT":
      return <Navigate to="/student" replace />;
    case "PENDING":
      return <Navigate to="/pending-approval" replace />;
    default:
      return <Navigate to="/pending-approval" replace />;
  }
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#0f172a",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(99,102,241,0.2)",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default RedirectByRolePage;