import express from 'express';
import {publicAnalytics} from '../controllers/public.controller.js';

const router = express.Router();

router.get('/analytics', publicAnalytics);
export default router;
  
  