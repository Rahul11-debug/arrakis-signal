import Complaint from '../models/Complaint.js';

export const citizenDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Complaint.countDocuments({ user: userId });

    const statusWise = await Complaint.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const recentComplaints = await Complaint.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const slaBreached = await Complaint.countDocuments({
      user: userId,
      slaDeadline: { $lt: new Date() },
      status: { $ne: 'resolved' },
    });

    res.json({
      totalComplaints: total,
      statusWise,
      slaBreached,
      recentComplaints,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const staffDashboard = async (req, res) => {
  try {
    const staffId = req.user._id;

    const assignedTotal = await Complaint.countDocuments({
      assignedTo: staffId,
    });

    const inProgress = await Complaint.countDocuments({
      assignedTo: staffId,
      status: 'in-progress',
    });

    const overdue = await Complaint.countDocuments({
      assignedTo: staffId,
      slaDeadline: { $lt: new Date() },
      status: { $ne: 'resolved' },
    });

    const recentAssigned = await Complaint.find({
      assignedTo: staffId,
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      assignedTotal,
      inProgress,
      overdue,
      recentAssigned,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const adminDashboard = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const statusStats = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const slaBreached = await Complaint.countDocuments({
      slaDeadline: { $lt: new Date() },
      status: { $ne: 'resolved' },
    });

    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const staffPerformance = await Complaint.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      {
        $group: {
          _id: '$assignedTo',
          resolvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      totalComplaints: total,
      statusStats,
      slaBreached,
      categoryStats,
      staffPerformance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
