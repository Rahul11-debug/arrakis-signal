import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../dashboard/DashboardLayout";
import api from "../../api/axios";
import { generateComplaintReport } from "../../api/complaint.api";
import { downloadReport } from "../../utils/downloadFile";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [slaStats, setSlaStats] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/complaints")
      .then((res) => {
        setComplaints(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    api.get("/sla/stats").then((res) => {
      setSlaStats(res.data);
    });
  }, []);

  const handleReport = async (id) => {
    try {
      const res = await generateComplaintReport(id);
      downloadFile(res.data, `complaint-${id}.pdf`);
    } catch (err) {
      alert("Failed to generate report");
    }
  };

  return (
    <DashboardLayout role="admin">
      <h2 className="text-2xl font-bold mb-6">
        Admin Dashboard – All Complaints
      </h2>

      {slaStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-indigo-600 text-white p-5 rounded-xl">
            <p>Total Complaints</p>
            <h2 className="text-3xl font-bold">{slaStats.totalComplaints}</h2>
          </div>

          <div className="bg-red-600 text-white p-5 rounded-xl">
            <p>SLA Breached</p>
            <h2 className="text-3xl font-bold">{slaStats.slaBreached}</h2>
          </div>

          <div className="bg-green-600 text-white p-5 rounded-xl">
            <p>Resolved Within SLA</p>
            <h2 className="text-3xl font-bold">{slaStats.resolvedWithinSla}</h2>
          </div>

          <button
            onClick={() => navigate("/public/map")}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            View Complaint Map
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{c.title}</td>
                <td>{c.status}</td>
                <td>{c.priority}</td>
                <td>{c.category}</td>
                <td>{c.assignedTo?.name || "Unassigned"}</td>
                <td>
                  <button
                    onClick={() => navigate(`/admin/complaints/${c._id}`)}
                    className="text-indigo-600 hover:underline"
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/admin/complaints/${c._id}`)}
                    className="text-indigo-600 hover:underline mr-3"
                  >
                    View
                  </button>

                  <button
                    onClick={() => downloadReport(c._id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    Generate Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {complaints.length === 0 && (
          <p className="p-6 text-center text-gray-500">No complaints found</p>
        )}
      </div>
    </DashboardLayout>
  );
}
