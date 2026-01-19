import complaint from '../models/Complaint.js';

export const overdueComplaints = async (req, res) => {
    const data = await complaint.find({ slaDeadline: { $lt: new Date() }, status: { $ne: 'resolved' } });
    res.json(data);
}; 

export const slaStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const breached = await Complaint.countDocuments({
      slaDeadline: { $lt: new Date() },
      status: { $ne: 'resolved' }
    });

    const resolvedWithinSla = await Complaint.countDocuments({
      status: 'resolved',
      resolvedAt: { $lte: '$slaDeadline' }
    });

    res.json({
      totalComplaints: total,
      slaBreached: breached,
      resolvedWithinSla
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

