import './StatsCard.css';

const StatsCard = ({ icon, label, value, color = 'primary', subtitle }) => {
  return (
    <div className={`stats-card stats-card-${color} slide-in`}>
      <div className="stats-icon-wrapper">
        <div className={`stats-icon stats-icon-${color}`}>
          {icon}
        </div>
      </div>
      
      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <h3 className="stats-value">{value}</h3>
        {subtitle && <p className="stats-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatsCard;