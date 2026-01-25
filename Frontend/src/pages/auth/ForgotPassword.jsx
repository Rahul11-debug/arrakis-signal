import { useState } from "react";
import { forgotPassword } from "../../api/auth.api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendLink = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      await forgotPassword(email);

      setStatus("success");
      setMessage(
        "If this email is registered, a reset link has been sent."
      );
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  const resendLink = async () => {
    try {
      setLoading(true);

      await forgotPassword(email);

      setStatus("success");
      setMessage("Reset link resent successfully");
    } catch {
      setStatus("error");
      setMessage("Failed to resend reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white p-8 rounded-xl w-96 text-center">

        <h2 className="text-2xl font-bold mb-4">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />

        <button
          onClick={sendLink}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded mb-3 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

       
        {status === "success" && (
          <p className="text-green-600 text-sm mb-3">
            {message}
          </p>
        )}

       
        {status === "error" && (
          <p className="text-red-600 text-sm mb-3">
            {message}
          </p>
        )}

     
        {status === "success" && (
          <button
            onClick={resendLink}
            disabled={loading}
            className="text-sm text-indigo-600 underline disabled:opacity-50"
          >
            Resend email link
          </button>
        )}

      </div>
    </div>
  );
}
