import DashboardLayout from "./DashboardLayout";

export default function CitizenDashboard() {
  return (
    <DashboardLayout role ="Citizen Dashboard">
        <h2 className="text-2xl font-bold mb-4">
        Citizen Dashboard
      </h2>
      
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2">Raise Complaint</h2>
          <p className="text-sm text-gray-600">
            Submit new civic complaints easily.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2">My Complaints</h2>
          <p className="text-sm text-gray-600">
            Track status of submitted complaints.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-2">Profile</h2>
          <p className="text-sm text-gray-600">
            View and update personal information.
          </p>
        </div>

        
      </div>

    </DashboardLayout>
  );
}

