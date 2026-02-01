import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import OtpVerify from "../pages/auth/OtpVerify";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import MyComplaints from "../pages/citizen/MyComplaints";
import ProtectedRoute from "../components/ProtectedRoute";
import CitizenDashboard from "../pages/dashboard/CitizenDashboard";
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import CreateComplaint from "../pages/citizen/CreateComplaint";
import StaffComplaintDetails from "../pages/staff/StaffComplaintDetails";
import AdminAnalytics from "../pages/dashboard/AdminAnalytics";
import AdminComplaintDetails from "../pages/admin/AdminComplaintDetails";
import ComplaintDetails from "../pages/citizen/ComplaintDetails";
import PublicAnalytics from "../pages/public/PublicAnalytics";
import ComplaintMap from "../pages/public/ComplaintMap";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<OtpVerify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/password/change/:token" element={<ResetPassword />} />
      <Route path="/public/analytics" element={<PublicAnalytics />} />
      <Route path="/public/map" element={<ComplaintMap />} />

      <Route
        path="/complaint/new"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <CreateComplaint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints/me"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <MyComplaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/citizen"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/staff"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/complaints/:id"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffComplaintDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints/:id"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <ComplaintDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/complaints/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminComplaintDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/complaints/:id"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffComplaintDetails />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
