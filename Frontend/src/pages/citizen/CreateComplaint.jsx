import { useState, useEffect } from "react";
import { createComplaint } from "../../api/complaint.api";
import DashboardLayout from "../dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function CreateComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    lat: null,
    lng: null,
    image: null,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: "Auto detected location",
          }));
        },
        () => {
          alert("Location permission denied");
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);

      data.append("location[lat]", form.lat);
      data.append("location[lng]", form.lng);
      data.append("location[address]", form.address);

      if (form.image) {
        data.append("image", form.image);
      }

      await createComplaint(data);

      alert("Complaint submitted successfully 🚀");
      navigate("/complaints/me");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to submit complaint"
      );
    }
  };

  return (
    <DashboardLayout role="citizen">
      <div className="max-w-xl mx-auto bg-slate-900 p-6 rounded-xl text-white border border-slate-700">
        <h2 className="text-2xl font-semibold mb-4">
          Raise a Complaint
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="title"
            placeholder="Complaint title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            required
          >
            <option value="">Select category</option>
            <option value="road">Road</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
            <option value="garbage">Garbage</option>
          </select>

          <textarea
            name="description"
            placeholder="Describe the issue"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            required
          />

          <input
            name="address"
            placeholder="Address (auto detected)"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          />

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full text-sm"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
