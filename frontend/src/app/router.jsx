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
import StaffLayout from "../layouts/StaffLayout";
import StudentLayout from "../layouts/StudentLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import FacilitiesAssetsPage from "../pages/admin/FacilitiesAssetsPage";
import BookingManagementPage from "../pages/admin/BookingManagementPage";
import MaintenanceTicketingPage from "../pages/admin/MaintenanceTicketingPage";
import NotificationsPage from "../pages/admin/NotificationsPage";
import VerificationPage from "../pages/admin/VerificationPage";

import ResourceListPage from "../pages/resources/ResourceListPage";
import MyBookingsPage from "../pages/bookings/MyBookingsPage";

import StudentDashboard from "../pages/common/StudentDashboard";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RedirectByRolePage />
      </ProtectedRoute>
    ),
  },

  { path: "/home", element: <HomePage /> },

  {
    path: "/profile",
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
  },

  {
    path: "/pending-approval",
    element: <ProtectedRoute><PendingApprovalPage /></ProtectedRoute>,
  },

  // ADMIN
  {
    path: "/admin",
    element: (
      <RoleRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <AdminPage /> },
      { path: "facilities", element: <FacilitiesAssetsPage /> },
      { path: "bookings", element: <BookingManagementPage /> },
      { path: "verify", element: <VerificationPage /> },
      { path: "maintenance", element: <MaintenanceTicketingPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  // STAFF
  {
    path: "/staff",
    element: (
      <RoleRoute allowedRoles={["STAFF", "TECHNICIAN", "ADMIN"]}>
        <StaffLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <StaffPage /> },
      { path: "facilities", element: <ResourceListPage /> },
      { path: "bookings", element: <MyBookingsPage /> },
      { path: "verify", element: <VerificationPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  {
    path: "/student",
    element: (
      <RoleRoute allowedRoles={["STUDENT"]}>
        <StudentLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  {
    path: "/technician",
    element: (
      <RoleRoute allowedRoles={["TECHNICIAN", "ADMIN"]}>
        <TechnicianPage />
      </RoleRoute>
    ),
  },

  { path: "/unauthorized", element: <UnauthorizedPage /> },
]);

export default router;