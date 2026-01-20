import express from 'express';
import {overdueComplaints,slaStats,slaMonitor } from '../controllers/sla.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorise } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/overdue', protect, authorise('admin'), overdueComplaints);
router.get('/stats', protect, authorise('admin'), slaStats);
router.get('/monitor', protect, authorise('admin', 'staff'), slaMonitor);
export default router;