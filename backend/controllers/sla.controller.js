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

export const slaMonitor = async (req, res) => {
  try {
    const now = new Date();
    const WARNING_HOURS = 6; 

    const complaints = await Complaint.find({
      status: { $ne: 'resolved' },
      slaDeadline: { $exists: true },
    })
      .populate('user', 'name email')
      .populate('assignedTo', 'name email role');

    const result = complaints.map(c => {
      const timeLeftMs = new Date(c.slaDeadline) - now;
      const timeLeftHours = Math.floor(timeLeftMs / (1000 * 60 * 60));

      let slaStatus = 'ON_TRACK';

      if (timeLeftMs <= 0) {
        slaStatus = 'BREACHED';
      } else if (timeLeftHours <= WARNING_HOURS) {
        slaStatus = 'NEARING_DEADLINE';
      }

      return {
        complaintId: c._id,
        title: c.title,
        status: c.status,
        priority: c.priority,
        assignedTo: c.assignedTo,
        slaDeadline: c.slaDeadline,
        timeLeftHours,
        slaStatus,
      };
    });

    res.json({
      totalMonitored: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};