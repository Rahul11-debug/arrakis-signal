import express from 'express';
import {
  createComplaint,
  myComplaints,
  allComplaints,
  updateStatus,
  heatmapData,
  getSingleComplaint,
  assignComplaint,
  updatePriority,
  deleteComplaint,
  generateComplaintReport
} from '../controllers/complaint.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorise } from '../middlewares/role.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createComplaint);
router.get('/me', protect, myComplaints);
router.get('/', protect, authorise('admin', 'staff'), allComplaints);
router.get('/:id', protect, getSingleComplaint);
router.put('/:id/status', protect, authorise('admin', 'staff'), updateStatus);
router.put('/:id/assign', protect, authorise('admin'), assignComplaint);
router.delete('/:id', protect, authorise('admin'), deleteComplaint);
router.put('/:id/priority', protect, authorise('admin'), updatePriority);
router.get('/:id/report', protect, authorise('admin', 'staff'), generateComplaintReport);
router.get('/heatmap', heatmapData);

export default router;
