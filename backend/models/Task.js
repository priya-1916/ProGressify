import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true
  },
  category: {
    type: String,
    enum: ['assignment', 'coding practice', 'exam prep', 'other'],
    default: 'other'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
taskSchema.index({ user: 1, completed: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;