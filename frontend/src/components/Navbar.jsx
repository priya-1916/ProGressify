import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LayoutDashboard, BookMarked, CheckSquare, BarChart3, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/add-study', label: 'Add Study', icon: <BookMarked size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/progress', label: 'Progress', icon: <BarChart3 size={20} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-logo">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <span>Student Tracker</span>
        </Link>

        <div className="navbar-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <div className="user-menu">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user?.name}</span>
          </div>
          
          <button onClick={handleLogout} className="btn-logout" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;