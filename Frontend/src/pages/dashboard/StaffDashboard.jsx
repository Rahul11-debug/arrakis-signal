import DashboardLayout from "./DashboardLayout";

export default function StaffDashboard() {
  return (
    <DashboardLayout title="Staff Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2">Assigned Complaints</h2>
          <p className="text-sm text-gray-600">
            View complaints assigned to you.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2">Update Status</h2>
          <p className="text-sm text-gray-600">
            Mark complaints as resolved or pending.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2">Reports</h2>
          <p className="text-sm text-gray-600">
            Daily work & performance report.
          </p>
        </div>

      </div>

    </DashboardLayout>
  );
}
