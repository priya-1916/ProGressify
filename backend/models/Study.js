import mongoose from 'mongoose';

const studySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true
  },
  hours: {
    type: Number,
    required: [true, 'Please add study hours'],
    min: [0.1, 'Hours must be at least 0.1'],
    max: [24, 'Hours cannot exceed 24']
  },
  taskDone: {
    type: String,
    required: [true, 'Please add task description'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
studySchema.index({ user: 1, date: -1 });

const Study = mongoose.model('Study', studySchema);

export default Study;