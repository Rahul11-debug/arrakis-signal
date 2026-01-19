import Notification from "../models/Notification.js";


export const myNotifications = async (req, res) => {
    const data = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(data);
};

export const markRead = async (req, res) => {
    const n = await Notification.findById(req.params.id);

    if (!n) {
        return res.status(404).json({ message: 'Notification not found' });
    }

    n.read = true;
    await n.save();
    res.json({ message: 'Notification marked as read' });
};  

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};