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
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import FacilitiesAssetsPage from "../pages/admin/FacilitiesAssetsPage";
import BookingManagementPage from "../pages/admin/BookingManagementPage";
import MaintenanceTicketingPage from "../pages/admin/MaintenanceTicketingPage";
import NotificationsPage from "../pages/admin/NotificationsPage";

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
        <AdminLayout />
      </RoleRoute>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "users", element: <AdminPage /> },
      { path: "facilities", element: <FacilitiesAssetsPage /> },
      { path: "bookings", element: <BookingManagementPage /> },
      { path: "maintenance", element: <MaintenanceTicketingPage /> },
      { path: "notifications", element: <NotificationsPage /> },
    ]
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