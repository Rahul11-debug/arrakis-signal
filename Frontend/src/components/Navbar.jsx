import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth.api";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      alert("Logged out");
      navigate("/login", { replace: true });
    } catch (err) {
      alert("Logout failed");
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
