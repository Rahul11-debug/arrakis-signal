import express from 'express';
import {publicStats , publicComplaints} from '../controllers/public.controller.js';

const router = express.Router();

router.get('/stats', publicStats);
router.get('/complaints', publicComplaints);

export default router;
  
  