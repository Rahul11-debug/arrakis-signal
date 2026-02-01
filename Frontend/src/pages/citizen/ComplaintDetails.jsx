import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../dashboard/DashboardLayout";
import api from "../../api/axios";

const steps = [
  "submitted",
  "assigned",
  "in-progress",
  "resolved",
  "closed",
];

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null)

  useEffect(() => {
    api.get(`/complaints/${id}`).then((res) => {
      const data = res.data;
      setComplaint(data);
    });
  }, [id]);

  if (!complaint) return null;
  return (
    <DashboardLayout role="citizen">
      <h2 className="text-2xl font-bold mb-6">Complaint Details</h2>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold">{complaint.title}</h3>
        <p className="text-gray-600 mt-2">{complaint.description}</p>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <p><b>Category:</b> {complaint.category}</p>
          <p><b>Status:</b> {complaint.status}</p>
          <p><b>Priority:</b> {complaint.priority}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h4 className="font-semibold mb-4">Progress</h4>

        <div className="space-y-3">
          {steps.map((step) => {
            const completed =
              steps.indexOf(step) <= steps.indexOf(complaint.status);

            return (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    completed ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                <span
                  className={`capitalize ${
                    completed ? "font-semibold text-green-700" : "text-gray-500"
                  }`}
                >
                  {step.replace("-", " ")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow">
        <h4 className="font-semibold mb-2">Remarks</h4>

        {complaint.remarks?.length > 0 ? (
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
      </div>
    </DashboardLayout>
  );
}
