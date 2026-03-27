import Study from '../models/Study.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Get dashboard overview
// @route   GET /api/dashboard
// @access  Private
export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get today's study hours
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStudies = await Study.find({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const todayHours = todayStudies.reduce((sum, study) => sum + study.hours, 0);

    // Get task statistics
    const allTasks = await Task.find({ user: req.user._id });
    const completedTasks = allTasks.filter(t => t.completed).length;
    const pendingTasks = allTasks.filter(t => !t.completed).length;

    // Get recent pending tasks (top 5)
    const recentPendingTasks = await Task.find({
      user: req.user._id,
      completed: false
    })
      .sort({ dueDate: 1, createdAt: -1 })
      .limit(5);

    // Get this week's total hours
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekStudies = await Study.find({
      user: req.user._id,
      date: {
        $gte: weekAgo,
        $lte: new Date()
      }
    });

    const weeklyHours = weekStudies.reduce((sum, study) => sum + study.hours, 0);

    res.json({
      streak: {
        current: user.currentStreak,
        longest: user.longestStreak,
        lastStudyDate: user.lastStudyDate
      },
      today: {
        hours: todayHours,
        studyCount: todayStudies.length
      },
      tasks: {
        total: allTasks.length,
        completed: completedTasks,
        pending: pendingTasks,
        recentPending: recentPendingTasks
      },
      weekly: {
        hours: weeklyHours,
        studyCount: weekStudies.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};