import Complaint from '../models/Complaint.js';

export const publicAnalytics = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const pending = await Complaint.countDocuments({ status: "submitted" });
    const inProgress = await Complaint.countDocuments({ status: "in-progress" });

    const slaBreached = await Complaint.countDocuments({
      slaDeadline: { $lt: new Date() },
      status: { $ne: "resolved" }
    });

    const categoryStats = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      resolved,
      pending,
      inProgress,
      slaBreached,
      categoryStats
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};