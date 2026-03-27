import Task from '../models/Task.js';

// @desc    Add new task
// @route   POST /api/tasks
// @access  Private
export const addTask = async (req, res) => {
  try {
    const { title, category, dueDate } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ message: 'Please provide task title' });
    }

    // Create task
    const task = await Task.create({
      user: req.user._id,
      title,
      category: category || 'other',
      dueDate: dueDate || null
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ completed: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending tasks
// @route   GET /api/tasks/pending
// @access  Private
export const getPendingTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      completed: false
    }).sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get completed tasks
// @route   GET /api/tasks/completed
// @access  Private
export const getCompletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      completed: true
    }).sort({ completedAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle task completion
// @route   PUT /api/tasks/:id/toggle
// @access  Private
export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, category, dueDate } = req.body;

    task.title = title || task.title;
    task.category = category || task.category;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.deleteOne();

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res) => {
  try {
    const allTasks = await Task.find({ user: req.user._id });
    
    const stats = {
      total: allTasks.length,
      completed: allTasks.filter(t => t.completed).length,
      pending: allTasks.filter(t => !t.completed).length,
      byCategory: {}
    };

    // Group by category
    allTasks.forEach(task => {
      if (!stats.byCategory[task.category]) {
        stats.byCategory[task.category] = {
          total: 0,
          completed: 0,
          pending: 0
        };
      }
      stats.byCategory[task.category].total++;
      if (task.completed) {
        stats.byCategory[task.category].completed++;
      } else {
        stats.byCategory[task.category].pending++;
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};