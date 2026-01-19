import Complaint from '../models/Complaint.js';

export const publicStats = async (req, res) => {
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    res.json({ pending, inProgress, resolved });
};

export const publicComplaints = async (req, res) => {
    const data = await Complaint.findById({},'category status location createdAt');
    res.json(data);
};