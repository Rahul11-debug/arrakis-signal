import express from 'express';
import {getUsers , updateRole} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorise } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', protect, authorise('admin'), getUsers);
router.put('/:id/role', protect, authorise('admin'), updateRole);

export default router;