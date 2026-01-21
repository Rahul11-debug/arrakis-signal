import express from 'express';
import {myNotifications , markRead,markAllAsRead} from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, myNotifications);
router.put('/:id/read', protect, markRead);
router.put('/read-all', protect, markAllAsRead);

export default router;