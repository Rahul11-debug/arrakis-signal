import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../dashboard/DashboardLayout";
import api from "../../api/axios";

export default function AdminComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    api.get(`/complaints/${id}`).then((res) => {
      setComplaint(res.data);
      setStatus(res.data.status);
      setPriority(res.data.priority);
    });

    api.get("/users?role=staff").then((res) => {
      setStaffList(res.data);
    });
  }, [id]);

  if (!complaint) return null;


  const assignStaff = async () => {
    if (!staffId) return alert("Select staff");

    await api.put(`/complaints/${id}/assign`, { staffId });
    alert("Assigned successfully");
  };

  const updateStatus = async () => {
    await api.put(`/complaints/${id}/status`, { status });
    alert("Status updated");
  };

  const updatePriority = async () => {
  await api.put(`/complaints/${id}/priority`, { priority });
  alert("Priority updated");
};


  const deleteComplaint = async () => {
    if (!window.confirm("Delete this complaint?")) return;

    await api.delete(`/complaints/${id}`);
    navigate("/dashboard/admin");
  };


  return (
    <DashboardLayout role="admin">
      <h2 className="text-2xl font-bold mb-4">
        Complaint Details
      </h2>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">

        <div>
          <h3 className="text-xl font-semibold">
            {complaint.title}
          </h3>
          <p className="text-gray-600 mt-1">
            {complaint.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <p><b>Status:</b> {complaint.status}</p>
            <p><b>Priority:</b> {complaint.priority}</p>
            <p><b>Category:</b> {complaint.category}</p>
            <p>
              <b>Assigned To:</b>{" "}
              {complaint.assignedTo?.name || "Unassigned"}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">
            Assign Task
          </h4>

          <select
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select staff</option>
            {staffList.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>

          <button
            onClick={assignStaff}
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Assign
          </button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">
            Update Status
          </h4>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="submitted">Submitted</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={updateStatus}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Update Status
          </button>
        </div>

<div className="border-t pt-4">
  <h4 className="font-semibold mb-2">
    Update Priority
  </h4>

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="border p-2 rounded w-full"
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>

  <button
    onClick={updatePriority}
    className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded"
  >
    Update Priority
  </button>
</div>

        <div className="border-t pt-4">
          <button
            onClick={deleteComplaint}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Complaint
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
