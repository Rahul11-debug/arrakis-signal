import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../dashboard/DashboardLayout";
import api from "../../api/axios";
import { generateComplaintReport } from "../../api/complaint.api";
import { downloadReport } from "../../utils/downloadFile";

export default function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [slaData, setSlaData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/complaints/filter").then((res) => {
      console.log("FILTER RESPONSE:", res.data);
      setComplaints(res.data.complaints || []);
    });
  }, []);

  const handleReport = async (id) => {
    try {
      const res = await generateComplaintReport(id);
      downloadFile(res.data, `complaint-${id}.pdf`);
    } catch (err) {
      alert("Report generation failed");
    }
  };

  return (
    <DashboardLayout role="staff">
      <h2 className="text-2xl font-bold mb-6">My Assigned Tasks</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Action</th>
              <th>SLA</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{c.title}</td>
                <td>{c.status}</td>
                <td>{c.priority}</td>
                <td>{c.category}</td>
                <td>
                  <button
                    onClick={() => navigate(`/staff/complaints/${c._id}`)}
                    className="text-indigo-600 hover:underline"
                  >
                    Open
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => navigate(`/staff/complaints/${c._id}`)}
                    className="text-indigo-600 hover:underline mr-3"
                  >
                    Open
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
          <p className="p-6 text-center text-gray-500">No tasks assigned</p>
        )}
      </div>
    </DashboardLayout>
  );
}
