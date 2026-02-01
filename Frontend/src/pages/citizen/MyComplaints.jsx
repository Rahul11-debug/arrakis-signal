import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myComplaints } from "../../api/complaint.api";
import DashboardLayout from "../dashboard/DashboardLayout";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    myComplaints().then(setComplaints);
  }, []);

  return (
    <DashboardLayout role="citizen">
      <h2 className="text-2xl font-bold mb-4">My Complaints</h2>
      <div className="space-y-4">
        {complaints.map((c) => (
          <div
            key={c._id}
            onClick={() => navigate(`/complaints/${c._id}`)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {c.description}
            </p>

            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-indigo-600 font-semibold">
                Status: {c.status}
              </span>

              <span className="text-xs text-gray-400">
                View Details →
              </span>
            </div>
          </div>
        ))}

        {complaints.length === 0 && (
          <p className="text-gray-500 text-sm">
            No complaints submitted yet.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
