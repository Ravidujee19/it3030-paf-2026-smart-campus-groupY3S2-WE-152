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
import AdminDashboard from "../pages/admin/AdminDashboard";
import FacilitiesAssetsPage from "../pages/admin/FacilitiesAssetsPage";
import BookingManagementPage from "../pages/admin/BookingManagementPage";
import MaintenanceTicketingPage from "../pages/admin/MaintenanceTicketingPage";
import NotificationsPage from "../pages/admin/NotificationsPage";
import ResourceListPage from "../pages/resources/ResourceListPage";
import MyBookingsPage from "../pages/bookings/MyBookingsPage";
import VerificationPage from "../pages/admin/VerificationPage";
import StudentDashboard from "../pages/common/StudentDashboard";

// Import Ticketing Components for Nested Routes
import TicketList from "../components/tickets/TicketList";
import TicketForm from "../components/tickets/TicketForm";
import TicketDetail from "../components/tickets/TicketDetail";

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
    element: <HomePage />,
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
      { path: "verify", element: <VerificationPage /> },
      { 
        path: "maintenance", 
        element: <MaintenanceTicketingPage />,
        children: [
          { index: true, element: <TicketList /> },
          { path: "new", element: <TicketForm /> },
          { path: ":id", element: <TicketDetail /> }
        ]
      },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "profile", element: <ProfilePage /> }
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
    path: "/student",
    element: (
      <RoleRoute allowedRoles={["STUDENT"]}>
        <StudentDashboard />
      </RoleRoute>
    ),
  },
  {
    path: "/staff",
    element: (
      <RoleRoute allowedRoles={["STAFF", "TECHNICIAN", "ADMIN"]}>
        <StaffLayout />
      </RoleRoute>
    ),
    children: [
      { path: "", element: <StaffPage /> },
      { path: "facilities", element: <ResourceListPage /> },
      { path: "bookings", element: <MyBookingsPage /> },
      { path: "verify", element: <VerificationPage /> },
      { 
        path: "maintenance", 
        element: <MaintenanceTicketingPage />,
        children: [
          { index: true, element: <TicketList /> },
          { path: "new", element: <TicketForm /> },
          { path: ":id", element: <TicketDetail /> }
        ]
      },
      { path: "profile", element: <ProfilePage /> }
    ]
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
]);

export default router;