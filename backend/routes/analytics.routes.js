import express from 'express';
import {overview , trends ,complaintsByStatus, complaintsByCategory,avgResolutionTime} from '../controllers/analytics.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorise } from '../middlewares/role.middleware.js';
const router = express.Router();

router.get('/overview', protect, overview);
router.get('/trends', protect, trends);
router.get('/status', protect, authorise('admin'), complaintsByStatus);
router.get('/category', protect, authorise('admin'), complaintsByCategory);
router.get('/resolution-time', protect, authorise('admin'), avgResolutionTime);

export default router;
