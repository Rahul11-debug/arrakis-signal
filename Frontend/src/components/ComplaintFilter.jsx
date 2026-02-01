import { useState } from "react";

export default function ComplaintFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilter = () => {
    onFilter(filters);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

      <select name="status" onChange={handleChange} className="border p-2 rounded">
        <option value="">All Status</option>
        <option value="submitted">Submitted</option>
        <option value="assigned">Assigned</option>
        <option value="in-progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>

      <select name="priority" onChange={handleChange} className="border p-2 rounded">
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select name="category" onChange={handleChange} className="border p-2 rounded">
        <option value="">All Category</option>
        <option value="road">Road</option>
        <option value="water">Water</option>
        <option value="electricity">Electricity</option>
      </select>

      <button
        onClick={applyFilter}
        className="bg-indigo-600 text-white rounded px-4 py-2"
      >
        Apply Filter
      </button>
    </div>
  );
}
