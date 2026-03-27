import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BookOpen, Flame, TrendingUp } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="auth-logo">
            <div className="logo-icon">
              <BookOpen size={32} strokeWidth={2.5} />
            </div>
            <h1>Student Tracker</h1>
          </div>
          
          <h2 className="auth-title">
            Track your progress.<br />
            Build your streak.<br />
            Achieve your goals.
          </h2>
          
          <div className="auth-features">
            <div className="feature-item">
              <div className="feature-icon">
                <Flame size={20} />
              </div>
              <div>
                <h4>Study Streaks</h4>
                <p>Stay consistent and watch your streak grow</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <TrendingUp size={20} />
              </div>
              <div>
                <h4>Track Progress</h4>
                <p>Monitor your study hours and productivity</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h3>Welcome Back</h3>
            <p>Login to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;