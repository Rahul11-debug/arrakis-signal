import Complaint from '../models/Complaint.js';
import PDFDocument from 'pdfkit';
import User from '../models/User.js';
import { allowedTransitions } from '../utils/complaintLifecycle.js';

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
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user._id, 
    })
      .populate('assignedTo', 'name email role')
      .populate('remarks.addedBy', 'name role')
      .populate('statusHistory.changedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found',
      });
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
  try {
    const complaints = await Complaint.find(
      {
        'location.lat': { $exists: true },
        'location.lng': { $exists: true },
      },
      {
        location: 1,
        _id: 0,
      }
    );

    const heatmapPoints = complaints.map(c => ({
      lat: c.location.lat,
      lng: c.location.lng,
      intensity: 1, 
    }));

    res.json(heatmapPoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(400).json({
        message: 'Remark message is required',
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found',
      });
    }

    complaint.remarks.push({
      message,
      addedBy: req.user._id,
    });

    await complaint.save();

    res.json({
      message: 'Remark added successfully',
      remarks: complaint.remarks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterComplaints = async (req, res) => {
  try {
    const {
      category,
      priority,
      locality,
      from,
      to,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (locality) {
      filter['location.adress'] = {
        $regex: locality,
        $options: 'i', 
      };
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};