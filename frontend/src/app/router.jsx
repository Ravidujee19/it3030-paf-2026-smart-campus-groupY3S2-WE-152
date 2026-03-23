import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RedirectByRolePage from "../pages/auth/RedirectByRolePage";
import HomePage from "../pages/common/HomePage";
import AdminPage from "../pages/common/AdminPage";
import TechnicianPage from "../pages/common/TechnicianPage";
import StaffPage from "../pages/common/StaffPage";
import UnauthorizedPage from "../pages/common/UnauthorizedPage";
import ProfilePage from "../pages/common/ProfilePage";
import PendingApprovalPage from "../pages/common/PendingApprovalPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RedirectByRolePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pending-approval",
    element: (
      <ProtectedRoute>
        <PendingApprovalPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <RoleRoute allowedRoles={["ADMIN"]}>
        <AdminPage />
      </RoleRoute>
    ),
  },
  {
    path: "/technician",
    element: (
      <RoleRoute allowedRoles={["TECHNICIAN", "ADMIN"]}>
        <TechnicianPage />
      </RoleRoute>
    ),
  },
  {
    path: "/staff",
    element: (
      <RoleRoute allowedRoles={["STAFF", "TECHNICIAN", "ADMIN"]}>
        <StaffPage />
      </RoleRoute>
    ),
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
]);

export default router;