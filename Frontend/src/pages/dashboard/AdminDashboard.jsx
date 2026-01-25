import DashboardLayout from "./DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2">All Complaints</h2>
          <p className="text-sm text-gray-600">
            Monitor all complaints across departments.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2">Manage Staff</h2>
          <p className="text-sm text-gray-600">
            Add or manage staff roles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2">Analytics</h2>
          <p className="text-sm text-gray-600">
            View performance & resolution stats.
          </p>
        </div>

      </div>

    </DashboardLayout>
  );
}

