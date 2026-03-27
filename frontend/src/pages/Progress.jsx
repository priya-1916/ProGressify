import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getWeeklyStats, getTaskStats } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { TrendingUp, BookOpen, CheckSquare } from 'lucide-react';
import './Progress.css';

const Progress = () => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [weekly, tasks] = await Promise.all([
        getWeeklyStats(),
        getTaskStats()
      ]);
      setWeeklyData(weekly);
      setTaskStats(tasks);
    } catch (error) {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const chartData = weeklyData?.weeklyData?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    hours: item.totalHours
  })) || [];

  return (
    <div className="page">
      <Navbar />
      
      <div className="container progress-container">
        <div className="page-header fade-in">
          <div>
            <h1>Your Progress</h1>
            <p className="page-subtitle">Track your weekly study patterns and achievements</p>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="summary-grid">
          <div className="summary-card card-hover slide-in">
            <div className="summary-icon summary-icon-primary">
              <TrendingUp size={24} />
            </div>
            <div className="summary-content">
              <p className="summary-label">Total Weekly Hours</p>
              <h3 className="summary-value">{weeklyData?.totalWeeklyHours?.toFixed(1) || 0} hrs</h3>
            </div>
          </div>

          <div className="summary-card card-hover slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="summary-icon summary-icon-success">
              <BookOpen size={24} />
            </div>
            <div className="summary-content">
              <p className="summary-label">Study Sessions</p>
              <h3 className="summary-value">{weeklyData?.totalEntries || 0}</h3>
            </div>
          </div>

          <div className="summary-card card-hover slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="summary-icon summary-icon-accent">
              <CheckSquare size={24} />
            </div>
            <div className="summary-content">
              <p className="summary-label">Tasks Completed</p>
              <h3 className="summary-value">{taskStats?.completed || 0}</h3>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="card chart-card fade-in">
          <div className="card-header">
            <div>
              <h3>Weekly Study Hours</h3>
              <p className="text-muted">Your study distribution over the last 7 days</p>
            </div>
          </div>
          
          {chartData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    style={{ fontSize: '14px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '14px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Bar 
                    dataKey="hours" 
                    fill="url(#colorGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <p>No study data for the past week. Start tracking to see your progress!</p>
            </div>
          )}
        </div>

        {/* Task Stats by Category */}
        {taskStats?.byCategory && Object.keys(taskStats.byCategory).length > 0 && (
          <div className="card fade-in">
            <div className="card-header">
              <div>
                <h3>Tasks by Category</h3>
                <p className="text-muted">Breakdown of your task completion</p>
              </div>
            </div>
            
            <div className="category-stats">
              {Object.entries(taskStats.byCategory).map(([category, stats]) => (
                <div key={category} className="category-item">
                  <div className="category-header">
                    <h4 className="category-name">{category}</h4>
                    <span className="category-count">{stats.total} tasks</span>
                  </div>
                  <div className="progress-bar-wrapper">
                    <div 
                      className="progress-bar"
                      style={{ 
                        width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <div className="category-stats-text">
                    <span>{stats.completed} completed</span>
                    <span>{stats.pending} pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;