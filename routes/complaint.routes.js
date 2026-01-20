import express from 'express';
import {
  createComplaint,
  myComplaints,
  allComplaints,
  updateStatus,
  heatmapData,
  assignComplaint,
  updatePriority,
  deleteComplaint,
  generateComplaintReport,
  getComplaintHistory,
  filterComplaints,
  getMySingleComplaint,
  addRemark
} from '../controllers/complaint.controller.js';
import { updateComplaintLifecycle } from '../controllers/complaint.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorise } from '../middlewares/role.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createComplaint);
router.get('/me', protect, myComplaints);
router.get('/', protect, authorise('admin', 'staff'), allComplaints);
router.get('/:id', protect, getMySingleComplaint);
router.put('/:id/status', protect, authorise('admin', 'staff'), updateStatus);
router.put('/:id/assign', protect, authorise('admin'), assignComplaint);
router.delete('/:id', protect, authorise('admin'), deleteComplaint);
router.put('/:id/priority', protect, authorise('admin'), updatePriority);
router.get('/:id/report', protect, authorise('admin', 'staff'), generateComplaintReport);
router.get('/heatmap', heatmapData);
router.put('/:id/lifecycle', protect, authorise('admin', 'staff'), updateComplaintLifecycle);
router.get('/:id/history', protect, getComplaintHistory);
router.post('/:id/remarks', protect, authorise('admin', 'staff'), addRemark);
router.get('/filter', protect, authorise('admin', 'staff'), filterComplaints);
export default router;




