import { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/DashboardLayout";
import { getAdminDashboard } from "../../api/dashboard.api";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminDashboard().then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return null;

  return (
    <DashboardLayout role="admin">
      <h2 className="text-2xl font-bold mb-6">Admin Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Complaints"
          value={data.totalComplaints}
          color="bg-indigo-600"
        />
        <StatCard
          title="SLA Breached"
          value={data.slaBreached}
          color="bg-red-600"
        />
        <StatCard
          title="Resolved Complaints"
          value={
            data.statusStats.find((s) => s._id === "resolved")?.count || 0
          }
          color="bg-green-600"
        />
      </div>
      <Section title="Complaints by Status">
        {data.statusStats.map((s) => (
          <Row key={s._id} label={s._id} value={s.count} />
        ))}
      </Section>

      <Section title="Complaints by Category">
        {data.categoryStats.map((c) => (
          <Row key={c._id} label={c._id} value={c.count} />
        ))}
      </Section>

      <Section title="Staff Performance (Resolved)">
        {data.staffPerformance.length === 0 && (
          <p className="text-gray-500">No staff data available</p>
        )}

        {data.staffPerformance.map((s) => (
          <Row
            key={s._id}
            label={`Staff ID: ${s._id}`}
            value={`${s.resolvedCount} resolved`}
          />
        ))}
      </Section>
    </DashboardLayout>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white p-6 rounded-xl shadow`}>
      <p className="text-sm opacity-80">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1 text-sm">
      <span className="text-gray-700">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
