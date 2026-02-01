import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PublicAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/public/analytics").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p className="p-10">Loading analytics...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        📊 Public Complaint Analytics
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
        <StatCard title="Total" value={data.total} />
        <StatCard title="Resolved" value={data.resolved} color="green" />
        <StatCard title="Pending" value={data.pending} color="orange" />
        <StatCard title="In Progress" value={data.inProgress} color="blue" />
        <StatCard title="SLA Breached" value={data.slaBreached} color="red" />
      </div>

      <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Complaints by Category
        </h2>

        {data.categoryStats.map((c) => (
          <div
            key={c._id}
            className="flex justify-between py-2 border-b text-sm"
          >
            <span>{c._id}</span>
            <span className="font-semibold">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, color = "gray" }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
    gray: "bg-gray-100 text-gray-700"
  };

  return (
    <div className={`p-4 rounded-xl text-center ${colors[color]}`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
