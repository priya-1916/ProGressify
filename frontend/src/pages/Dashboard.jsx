import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../services/api';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import TaskList from '../components/TaskList';
import { Flame, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      
      <div className="container dashboard-container">
        <div className="dashboard-header fade-in">
          <div>
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-subtitle">Here's your productivity overview for today</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatsCard
            icon={<Flame />}
            label="Current Streak"
            value={`${dashboard?.streak?.current || 0} days`}
            color="accent"
            subtitle={`Longest: ${dashboard?.streak?.longest || 0} days`}
          />
          
          <StatsCard
            icon={<Clock />}
            label="Today's Study"
            value={`${dashboard?.today?.hours?.toFixed(1) || 0} hrs`}
            color="primary"
            subtitle={`${dashboard?.today?.studyCount || 0} sessions`}
          />
          
          <StatsCard
            icon={<CheckCircle />}
            label="Tasks Completed"
            value={dashboard?.tasks?.completed || 0}
            color="success"
            subtitle={`Total: ${dashboard?.tasks?.total || 0} tasks`}
          />
          
          <StatsCard
            icon={<AlertCircle />}
            label="Pending Tasks"
            value={dashboard?.tasks?.pending || 0}
            color="warning"
            subtitle="Need attention"
          />
        </div>

        {/* Weekly Overview */}
        <div className="card weekly-card fade-in">
          <div className="card-header">
            <div>
              <h3>This Week</h3>
              <p className="text-muted">Your productivity summary</p>
            </div>
          </div>
          <div className="weekly-stats">
            <div className="weekly-stat">
              <span className="weekly-label">Total Study Hours</span>
              <span className="weekly-value">{dashboard?.weekly?.hours?.toFixed(1) || 0} hrs</span>
            </div>
            <div className="weekly-stat">
              <span className="weekly-label">Study Sessions</span>
              <span className="weekly-value">{dashboard?.weekly?.studyCount || 0}</span>
            </div>
            <div className="weekly-stat">
              <span className="weekly-label">Average per Day</span>
              <span className="weekly-value">
                {dashboard?.weekly?.studyCount 
                  ? (dashboard.weekly.hours / 7).toFixed(1) 
                  : 0} hrs
              </span>
            </div>
          </div>
        </div>

        {/* Recent Pending Tasks */}
        <div className="card fade-in">
          <div className="card-header">
            <div>
              <h3>Pending Tasks</h3>
              <p className="text-muted">Your upcoming tasks</p>
            </div>
          </div>
          <TaskList 
            tasks={dashboard?.tasks?.recentPending || []} 
            onUpdate={fetchDashboard}
            limit={5}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;