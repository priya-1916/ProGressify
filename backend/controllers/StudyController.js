import Study from '../models/Study.js';
import User from '../models/User.js';

// @desc    Add new study entry
// @route   POST /api/studies
// @access  Private
export const addStudy = async (req, res) => {
  try {
    const { subject, hours, taskDone } = req.body;

    // Validation
    if (!subject || !hours || !taskDone) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Create study entry
    const study = await Study.create({
      user: req.user._id,
      subject,
      hours,
      taskDone
    });

    // Update user streak
    const user = await User.findById(req.user._id);
    user.updateStreak();
    
    // ✅ FINAL FIX: Save without validation
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      study,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak
    });
  } catch (error) {
    console.error('Error in addStudy:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all study entries for logged-in user
// @route   GET /api/studies
// @access  Private
export const getStudies = async (req, res) => {
  try {
    const studies = await Study.find({ user: req.user._id })
      .sort({ date: -1 });

    res.json(studies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's study entries
// @route   GET /api/studies/today
// @access  Private
export const getTodayStudies = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const studies = await Study.find({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Calculate total hours for today
    const totalHours = studies.reduce((sum, study) => sum + study.hours, 0);

    res.json({
      studies,
      totalHours
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get weekly statistics
// @route   GET /api/studies/weekly
// @access  Private
export const getWeeklyStats = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const studies = await Study.find({
      user: req.user._id,
      date: {
        $gte: weekAgo,
        $lte: today
      }
    }).sort({ date: 1 });

    // Group by day
    const dailyStats = {};
    
    studies.forEach(study => {
      const dateKey = study.date.toISOString().split('T')[0];
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          date: dateKey,
          totalHours: 0,
          subjects: []
        };
      }
      dailyStats[dateKey].totalHours += study.hours;
      dailyStats[dateKey].subjects.push(study.subject);
    });

    const weeklyData = Object.values(dailyStats);
    const totalWeeklyHours = studies.reduce((sum, study) => sum + study.hours, 0);

    res.json({
      weeklyData,
      totalWeeklyHours,
      totalEntries: studies.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a study entry
// @route   DELETE /api/studies/:id
// @access  Private
export const deleteStudy = async (req, res) => {
  try {
    const study = await Study.findById(req.params.id);

    if (!study) {
      return res.status(404).json({ message: 'Study entry not found' });
    }

    // Make sure user owns the study entry
    if (study.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await study.deleteOne();

    res.json({ message: 'Study entry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};