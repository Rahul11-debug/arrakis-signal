import complaint from '../models/Complaint.js';

export const overview = async (req, res) => {
    const total = await complaint.countDocuments();
    const resolved = await complaint.countDocuments({ status: 'resolved' });
    const pending = await complaint.countDocuments({ status: 'pending' });
    const inProgress = await complaint.countDocuments({ status: 'in-progress' });
    res.json({ total, resolved, pending, inProgress });
};

export const trends = async (req, res) => {
    const data = await complaint.aggregate([
        {
            $group: {
                _id : $category,
                count: { $sum: 1 }
            }   
        }
    ]);
    res.json(data);
};

export const complaintsByStatus = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    data.forEach(item => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const complaintsByCategory = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const avgResolutionTime = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $match: {
          status: 'resolved',
          resolvedAt: { $exists: true }
        }
      },
      {
        $project: {
          resolutionTime: {
            $subtract: ['$resolvedAt', '$createdAt']
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$resolutionTime' }
        }
      }
    ]);

    res.json({
      averageResolutionTimeInHours:
        data.length > 0 ? data[0].avgTime / (1000 * 60 * 60) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
