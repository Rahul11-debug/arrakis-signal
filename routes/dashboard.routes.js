import express from 'express';
import {
  citizenDashboard,
  staffDashboard,
  adminDashboard,
} from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorise } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/citizen', protect, authorise('user'), citizenDashboard);
router.get('/staff', protect, authorise('staff'), staffDashboard);
router.get('/admin', protect, authorise('admin'), adminDashboard);

export default router;
