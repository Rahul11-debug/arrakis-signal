import express from 'express';
import {overdueComplaints,slaStats } from '../controllers/sla.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorise } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/overdue', protect, authorise('admin'), overdueComplaints);
router.get('/stats', protect, authorise('admin'), slaStats);
export default router;