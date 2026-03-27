import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { addStudy } from '../services/api';
import toast from 'react-hot-toast';
import { BookOpen, Clock, FileText } from 'lucide-react';
import './AddStudy.css';

const AddStudy = () => {
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');
  const [taskDone, setTaskDone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject || !hours || !taskDone) {
      toast.error('Please fill all fields');
      return;
    }

    if (parseFloat(hours) <= 0 || parseFloat(hours) > 24) {
      toast.error('Hours must be between 0.1 and 24');
      return;
    }

    setLoading(true);

    try {
      const response = await addStudy({
        subject,
        hours: parseFloat(hours),
        taskDone
      });
      
      toast.success(`🔥 Study added! Streak: ${response.currentStreak} days`, {
        duration: 4000
      });
      
      setSubject('');
      setHours('');
      setTaskDone('');
      
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add study');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      
      <div className="container add-study-container">
        <div className="add-study-content">
          <div className="page-header fade-in">
            <div>
              <h1>Add Study Session</h1>
              <p className="page-subtitle">Track your learning progress and build your streak</p>
            </div>
          </div>

          <div className="form-card card slide-in">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="subject">
                  <BookOpen size={18} />
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  className="input"
                  placeholder="e.g., Data Structures, Physics, Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="hours">
                  <Clock size={18} />
                  Hours Studied
                </label>
                <input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0.1"
                  max="24"
                  className="input"
                  placeholder="e.g., 2.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                />
                <small>Enter hours (0.1 to 24)</small>
              </div>

              <div className="input-group">
                <label htmlFor="taskDone">
                  <FileText size={18} />
                  What did you accomplish?
                </label>
                <textarea
                  id="taskDone"
                  className="input"
                  placeholder="e.g., Completed binary tree problems, Practiced thermodynamics"
                  rows="4"
                  value={taskDone}
                  onChange={(e) => setTaskDone(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Study Session'}
                </button>
              </div>
            </form>
          </div>

          <div className="tips-card card slide-in">
            <h3>💡 Tips for Effective Study Tracking</h3>
            <ul className="tips-list">
              <li>Log your study sessions daily to build a streak</li>
              <li>Be specific about what you accomplished</li>
              <li>Track actual study time, not break time</li>
              <li>Consistency matters more than long hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudy;