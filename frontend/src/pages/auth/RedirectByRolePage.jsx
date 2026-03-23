import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RedirectByRolePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "TECHNICIAN") {
    return <Navigate to="/technician" replace />;
  }

  if (user.role === "STAFF") {
    return <Navigate to="/staff" replace />;
  }

  if (user.role === "PENDING") {
    return <Navigate to="/pending-approval" replace />;
  }

  return <Navigate to="/profile" replace />;
}

export default RedirectByRolePage;