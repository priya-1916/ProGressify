import express from 'express';
import {
  addStudy,
  getStudies,
  getTodayStudies,
  getWeeklyStats,
  deleteStudy
} from '../controllers/StudyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(addStudy)
  .get(getStudies);

router.get('/today', getTodayStudies);
router.get('/weekly', getWeeklyStats);
router.delete('/:id', deleteStudy);

export default router;