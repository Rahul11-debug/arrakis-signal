import express from 'express';
import {
  createComplaint,
  myComplaints,
  allComplaints,
  updateComplaintStatus,
  assignComplaint,
  updatePriority,
  deleteComplaint,
  generateComplaintReport,
  getComplaintHistory,
  filterComplaints,
  getMySingleComplaint,
  addRemark,
  getPublicMapComplaints,
} from '../controllers/complaint.controller.js';
import { updateComplaintLifecycle } from '../controllers/complaint.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorise } from '../middlewares/role.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();
router.get('/me', protect, myComplaints);
router.get('/filter', protect, authorise('admin', 'staff'), filterComplaints);
router.get('/public/map', getPublicMapComplaints);

router.put('/:id/assign', protect, authorise('admin', 'staff'), assignComplaint);
router.put('/:id/status', protect, authorise('admin', 'staff'), updateComplaintStatus);
router.put('/:id/priority', protect, authorise('admin'), updatePriority);
router.put('/:id/lifecycle', protect, authorise('admin', 'staff'), updateComplaintLifecycle);
router.post('/:id/remarks', protect, authorise('admin', 'staff'), addRemark);
router.get('/:id/report', protect, authorise('admin', 'staff'), generateComplaintReport);
router.get('/:id/history', protect, getComplaintHistory);

router.get('/:id', protect, getMySingleComplaint);

router.post('/', protect, upload.single('image'), createComplaint);
router.delete('/:id', protect, authorise('admin'), deleteComplaint);

router.get('/', protect, authorise('admin', 'staff'), allComplaints);


export default router;



