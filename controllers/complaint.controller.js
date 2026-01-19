import Complaint from '../models/Complaint.js';
import PDFDocument from 'pdfkit';
import User from '../models/User.js';

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

export const getSingleComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }
    if (
      req.user.role === 'user' &&
      complaint.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const allComplaints = async (req, res) => {
    const data = await Complaint.find().populate('user assignedTo', 'name email');
    res.json(data);
};

export const updateStatus = async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);
    complaint.status = req.body.status || complaint.status;
    await complaint.save();
    res.json(complaint);
};

export const assignComplaint = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        message: 'staffId is required'
      });
    }

    const staff = await User.findById(staffId);
    if (!staff || staff.role !== 'staff') {
      return res.status(400).json({
        message: 'Invalid staff user'
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }

    complaint.assignedTo = staffId;
    complaint.status = 'in-progress';

    await complaint.save();

    res.json({
      message: 'Complaint assigned successfully',
      complaint
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
      .populate('user', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=complaint-${complaint._id}.pdf`
    );

    doc.pipe(res);

    doc
      .fontSize(20)
      .text('Complaint Report', { align: 'center' })
      .moveDown(2);

    doc.fontSize(12);

    doc.text(`Complaint ID: ${complaint._id}`);
    doc.text(`Title: ${complaint.title}`);
    doc.text(`Description: ${complaint.description}`);
    doc.text(`Category: ${complaint.category}`);
    doc.text(`Status: ${complaint.status}`);
    doc.text(`Priority: ${complaint.priority}`);
    doc.moveDown();

    doc.text('Location:', { underline: true });
    doc.text(`Address: ${complaint.location.address}`);
    doc.text(`Latitude: ${complaint.location.lat}`);
    doc.text(`Longitude: ${complaint.location.lng}`);
    doc.moveDown();

    doc.text('Reported By:', { underline: true });
    doc.text(`Name: ${complaint.user.name}`);
    doc.text(`Email: ${complaint.user.email}`);
    doc.moveDown();

    if (complaint.assignedTo) {
      doc.text('Assigned To:', { underline: true });
      doc.text(`Name: ${complaint.assignedTo.name}`);
      doc.text(`Email: ${complaint.assignedTo.email}`);
      doc.moveDown();
    }

    doc.text(`Created At: ${complaint.createdAt}`);
    if (complaint.resolvedAt) {
      doc.text(`Resolved At: ${complaint.resolvedAt}`);
    }

    doc.end();
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const heatmapData = async (req, res) => {
    const data = await Complaint.find({}, '{location:1, _id:0}');
    res.json(data);
};
