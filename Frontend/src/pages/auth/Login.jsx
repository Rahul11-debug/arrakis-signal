import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/Input";
import { loginUser } from "../../api/auth.api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    setLoading(true);

    const res = await loginUser(form);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "citizen") navigate("/dashboard/citizen", { replace: true });
    if (user.role === "staff") navigate("/dashboard/staff", { replace: true });
    if (user.role === "admin") navigate("/dashboard/admin", { replace: true });

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white backdrop-blur-md rounded-2xl p-5 shadow-2xl text-center w-full max-w-md">
        <div className="bg-white p-5 rounded-xl w-full space-y-4">

          <h2 className="text-2xl font-bold text-center">
            Login
          </h2>

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-indigo-600 text-white py-2 px-2 rounded-lg hover:bg-indigo-700 transition w-full disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            onClick={() => navigate("/forgot-password")}
            className="text-center text-sm text-indigo-400 hover:underline cursor-pointer"
          >
            Forgot Password?
          </p>

        </div>
      </div>
    </div>
  );
}
