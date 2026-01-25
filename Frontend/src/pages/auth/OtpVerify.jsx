import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email;
  const roleFromRegister = location.state?.role;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await verifyOtp({
        email,
        otp,
      });

    
      login(res.data.user);

      
      navigate(`/dashboard/${res.data.user.role}`);

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setMessage("");

      resendOtp(email);

      setMessage("OTP resent successfully");
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!email && !roleFromRegister) {
    navigate("/register");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white p-6 rounded-xl w-80 text-center">

        <h2 className="text-xl font-bold mb-4">
          Verify OTP
        </h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border px-3 py-2 mb-4 text-center"
        />

        {error && (
          <p className="text-red-600 text-sm mb-2">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-600 text-sm mb-2">
            {message}
          </p>
        )}

        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 mb-3 rounded disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <p
          onClick={handleResendOtp}
          className="text-center text-sm text-indigo-400 hover:underline cursor-pointer"
        >
          Resend OTP
        </p>

      </div>
    </div>
  );
}
