import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ role, children }) {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    if (role === "citizen") {
      navigate("/complaint/new");
    } else if (role === "staff") {
      navigate("/complaints/assigned");
    } else if (role === "admin") {
      navigate("/admin/analytics");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center px-6 py-4 bg-indigo-700 text-white">
        <h1 className="text-xl font-bold">Arrakis Signal</h1>

        <div className="flex gap-4 items-center">
          <button
            onClick={handlePrimaryAction}
            className="bg-white text-indigo-700 px-4 py-1 rounded-lg font-semibold"
          >
            {role === "citizen" && "Raise Complaint"}

            {role === "admin" && "View Analytics"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="bg-white text-indigo-700 px-4 py-1 rounded-lg font-semibold hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}
