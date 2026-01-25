import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import OtpVerify from "./pages/auth/OtpVerify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import CitizenDashboard from "./pages/dashboard/CitizenDashboard";
import StaffDashboard from "./pages/dashboard/StaffDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

export default function App() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<OtpVerify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/password/change/:token" element={<ResetPassword />} />

      {/* ===== PROTECTED DASHBOARD ROUTES ===== */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
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
        path="/dashboard/citizen"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />

      {/* ===== FALLBACK (VERY IMPORTANT) ===== */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
  

