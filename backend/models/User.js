import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastStudyDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// ✅ FINAL FIX: Hash password before saving (NO next() callback)
userSchema.pre('save', async function() {
  // Only hash password if it has been modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update streak method
userSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!this.lastStudyDate) {
    // First time studying
    this.currentStreak = 1;
    this.lastStudyDate = today;
  } else {
    const lastStudy = new Date(this.lastStudyDate);
    lastStudy.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today - lastStudy);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already studied today, no change
      return;
    } else if (diffDays === 1) {
      // Consecutive day
      this.currentStreak += 1;
      this.lastStudyDate = today;
    } else {
      // Streak broken
      this.currentStreak = 1;
      this.lastStudyDate = today;
    }
  }

  // Update longest streak if current is higher
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
};

const User = mongoose.model('User', userSchema);

export default User;