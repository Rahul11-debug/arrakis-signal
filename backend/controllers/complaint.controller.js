import Complaint from '../models/Complaint.js';
import PDFDocument from 'pdfkit';
import User from '../models/User.js';
import { allowedTransitions } from '../utils/complaintLifecycle.js';
import { sendMail } from '../utils/mail.js';

export const createComplaint = async (req, res) => {
  try {
    const SLA_HOURS = 72;

    const complaint = await Complaint.create({
      ...req.body,

      image: req.file
        ? {
            url: `/uploads/complaints/${req.file.filename}`,
            filename: req.file.filename
          }
        : null,

      user: req.user._id,

      slaDeadline: new Date(
        Date.now() + SLA_HOURS * 60 * 60 * 1000
      )
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: 'Complaint creation failed',
      error: error.message
    });
  }
};

export const myComplaints = async (req, res) => {
    const data = await Complaint.find({ user: req.user._id });
    res.json(data);
};

export const getMySingleComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (
      req.user.role === 'citizen' &&
      complaint.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (
      req.user.role === 'staff' &&
      complaint.assignedTo &&
      complaint.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      id: complaint._id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status,
      location: complaint.location,
      image: complaint.image,
      assignedTo: complaint.assignedTo,
      remarks: complaint.remarks,
      statusHistory: complaint.statusHistory,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const allComplaints = async (req, res) => {
    const data = await Complaint.find().populate('user assignedTo', 'name email');
    res.json(data);
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;

    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    if (complaint.user && complaint.user.email) {
      await sendMail(
        complaint.user.email,
        "Complaint Status Updated",
        `Hello ${complaint.user.name},

Your complaint "${complaint.title}" status is now: ${status.toUpperCase()}.

Thank you,
Arrakis Signal`
      );
    }

    res.json({
      message: "Status updated successfully",
      complaint,
    });

  } catch (error) {
    console.error("❌ STATUS UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const assignComplaint = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "staffId is required" });
    }

    const staff = await User.findById(staffId);

    if (!staff || staff.role !== "staff") {
      return res.status(400).json({ message: "Invalid staff user" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (
      req.user.role === "staff" &&
      complaint.assignedTo &&
      complaint.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only reassign complaints assigned to you",
      });
    }

    complaint.assignedTo = staffId;
    complaint.status = "assigned";

    complaint.statusHistory.push({
      status: "assigned",
      changedBy: req.user._id,
    });

    await complaint.save();

    res.json({
      message: "Complaint assigned successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        message: 'Invalid priority value'
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }

    complaint.priority = priority;
    await complaint.save();

    res.json({
      message: 'Priority updated successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }

    await complaint.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const generateComplaintReport = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=complaint-${complaint._id}.pdf`,
    });

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(res);

    doc.fontSize(20).text("Complaint Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Title: ${complaint.title}`);
    doc.text(`Description: ${complaint.description}`);
    doc.text(`Category: ${complaint.category}`);
    doc.text(`Priority: ${complaint.priority}`);
    doc.text(`Status: ${complaint.status}`);
    doc.moveDown();

    doc.text(`Citizen: ${complaint.user?.name || "N/A"}`);
    doc.text(`Assigned To: ${complaint.assignedTo?.name || "Unassigned"}`);
    doc.text(`Created At: ${new Date(complaint.createdAt).toLocaleString()}`);

    if (complaint.slaDeadline) {
      doc.moveDown();
      doc.text(`SLA Deadline: ${new Date(complaint.slaDeadline).toLocaleString()}`);
    }

    doc.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateComplaintLifecycle = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const currentStatus = complaint.status;
    const allowedNext = allowedTransitions[currentStatus];

    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        message: `Cannot move complaint from ${currentStatus} to ${status}`,
      });
    }

    complaint.status = status;

    if (status === 'assigned' && !complaint.assignedTo) {
      return res.status(400).json({
        message: 'Assign staff before marking as assigned',
      });
    }

    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
    }

    complaint.statusHistory.push({
      status,
      changedBy: req.user._id,
    });

    await complaint.save();

    res.json({
      message: 'Complaint status updated successfully',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintHistory = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('statusHistory.changedBy', 'name role');

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  res.json(complaint.statusHistory);
};

export const addRemark = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Remark message required" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.remarks.push({
      message,
      by: req.user._id,
      role: req.user.role,
      createdAt: new Date(),
    });

    await complaint.save();

    res.json({
      message: "Remark added",
      remarks: complaint.remarks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterComplaints = async (req, res) => {
  try {
    const filters = {};
    const { status, category, priority, dateFrom, dateTo } = req.query;
    if (status) filters.status = status;
    if (category) filters.category = category;  
    if (priority) filters.priority = priority;
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filters.createdAt.$lte = new Date(dateTo);
    }   
    const complaints = await Complaint.find(filters)
      .populate('user assignedTo', 'name email');

    res.json({ complaints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

export const getPublicMapComplaints = async (req, res) => {
  const complaints = await Complaint.find(
    {
      "location.lat": { $exists: true },
      "location.lng": { $exists: true }
    },
    {
      title: 1,
      status: 1,
      priority: 1,
      location: 1
    }
  );

  res.json(complaints);
};


