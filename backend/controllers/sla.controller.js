import Complaint from "../models/Complaint.js";
import { sendMail } from "../utils/mail.js";

export const overdueComplaints = async (req, res) => {
  const data = await Complaint.find({
    slaDeadline: { $lt: new Date() },
    status: { $nin: ["resolved", "closed"] },
  });

  res.json(data);
};

export const slaStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const breached = await Complaint.countDocuments({
      slaDeadline: { $lt: new Date() },
      status: { $nin: ["resolved", "closed"] },
    });

    const resolvedWithinSla = await Complaint.countDocuments({
      status: "resolved",
      $expr: { $lte: ["$resolvedAt", "$slaDeadline"] },
    });

    res.json({
      totalComplaints: total,
      slaBreached: breached,
      resolvedWithinSla,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const slaMonitor = async (req, res) => {
  try {
    const now = new Date();

    const complaints = await Complaint.find({
      status: { $ne: "resolved" },
      slaDeadline: { $lt: now },
    }).populate("user", "name email");

    for (const c of complaints) {
      await sendMail({
        to: c.user.email,
        subject: "⚠ SLA Breach Alert",
        html: `
          <h3>Dear ${c.user.name},</h3>
          <p>Your complaint <b>${c.title}</b> has exceeded the SLA deadline.</p>
          <p>We apologize for the delay and are escalating the issue.</p>
          <br/>
          <p>Regards,<br/>Arrakis Signal Team</p>
        `,
      });
    }

    res.json({
      message: "SLA breach emails sent",
      count: complaints.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
