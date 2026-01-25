import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import OtpVerify from "../pages/auth/OtpVerify";
import CitizenDashboard from "../pages/dashboard/CitizenDashboard";
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OtpVerify />} />

        <Route path="/dashboard/citizen" element={<CitizenDashboard />} />
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
