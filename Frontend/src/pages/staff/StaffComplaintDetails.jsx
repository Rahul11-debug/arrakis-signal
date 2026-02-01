import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../dashboard/DashboardLayout";
import api from "../../api/axios";

export default function StaffComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [remark, setRemark] = useState("");

  const fetchComplaint = async () => {
    const res = await api.get(`/complaints/${id}`);
    setComplaint(res.data);
    setStatus(res.data.status);
    setPriority(res.data.priority);
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  if (!complaint) return <p>Loading...</p>;

  const updateStatus = async () => {
    await api.put(`/complaints/${id}/status`, { status });
    alert("Status updated");
    fetchComplaint();
  };

  const updatePriority = async () => {
    await api.put(`/complaints/${id}/priority`, { priority });
    alert("Priority updated");
    fetchComplaint();
  };

  const addRemark = async () => {
    if (!remark.trim()) return;

    await api.post(`/complaints/${id}/remarks`, {
      message: remark,
    });

    alert("Remark added");
    setRemark("");
    fetchComplaint();
  };

  const deleteComplaint = async () => {
    if (!window.confirm("Delete this resolved complaint?")) return;

    await api.delete(`/complaints/${id}`);
    navigate("/dashboard/staff");
  };

  return (
    <DashboardLayout role="staff">
      <h2 className="text-2xl font-bold mb-4">Complaint Details</h2>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <h3 className="text-xl font-semibold">{complaint.title}</h3>
          <p className="text-gray-600 mt-1">{complaint.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <b>Category:</b> {complaint.category}
          </p>
          <p>
            <b>Status:</b> {complaint.status}
          </p>
          <p>
            <b>Priority:</b> {complaint.priority}
          </p>
          <p>
            <b>Assigned To:</b> {complaint.assignedTo?.name || "N/A"}
          </p>
        </div>

        <div className="border-t pt-4">
          <label className="font-semibold">Update Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded mt-2"
          >
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            onClick={updateStatus}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Update Status
          </button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Remarks</h4>

          {complaint.remarks && complaint.remarks.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {complaint.remarks.map((r, i) => (
                <li key={i} className="bg-gray-100 p-2 rounded">
                  <p>{r.message}</p>
                  <span className="text-xs text-gray-500">
                    {r.role} • {new Date(r.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No remarks yet</p>
          )}

          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Add remark..."
            className="w-full border p-2 rounded mt-3"
          />

          <button
            onClick={addRemark}
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Add Remark
          </button>
        </div>

        {complaint.status === "resolved" && (
          <div className="border-t pt-4">
            <button
              onClick={deleteComplaint}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Complaint
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
