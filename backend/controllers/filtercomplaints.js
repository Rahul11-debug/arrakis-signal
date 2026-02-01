export default function ComplaintFilter({ onFilter }) {
  const handleChange = (e) => {
    onFilter((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">

      <select name="status" onChange={handleChange} className="border p-2 rounded">
        <option value="">All Status</option>
        <option value="submitted">Submitted</option>
        <option value="assigned">Assigned</option>
        <option value="in-progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <select name="priority" onChange={handleChange} className="border p-2 rounded">
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="text"
        name="category"
        placeholder="Category"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        type="date"
        name="fromDate"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        type="date"
        name="toDate"
        onChange={handleChange}
        className="border p-2 rounded"
      />
    </div>
  );
}
