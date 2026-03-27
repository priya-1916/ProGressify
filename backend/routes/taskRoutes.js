import express from 'express';
import {
  addTask,
  getTasks,
  getPendingTasks,
  getCompletedTasks,
  toggleTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(addTask)
  .get(getTasks);

router.get('/pending', getPendingTasks);
router.get('/completed', getCompletedTasks);
router.get('/stats', getTaskStats);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.put('/:id/toggle', toggleTask);

export default router;