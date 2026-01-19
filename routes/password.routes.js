import express from 'express';
import { forgotPassword, resetPassword ,changePassword} from '../controllers/password.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);
router.put('/change', protect, changePassword);
export default router;
