import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { toggleTask, deleteTask } from '../services/api';
import toast from 'react-hot-toast';
import './TaskList.css';

const TaskList = ({ tasks, onUpdate, limit }) => {
  const displayTasks = limit ? tasks.slice(0, limit) : tasks;

  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      toast.success('Task updated');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'assignment': { color: 'primary', label: 'Assignment' },
      'coding practice': { color: 'success', label: 'Coding' },
      'exam prep': { color: 'warning', label: 'Exam' },
      'other': { color: 'gray', label: 'Other' }
    };
    return badges[category] || badges.other;
  };

  if (displayTasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {displayTasks.map((task, index) => {
        const badge = getCategoryBadge(task.category);
        return (
          <div 
            key={task._id} 
            className="task-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <button
              className="task-checkbox"
              onClick={() => handleToggle(task._id)}
            >
              {task.completed ? (
                <CheckCircle className="task-icon-completed" size={22} />
              ) : (
                <Circle className="task-icon-pending" size={22} />
              )}
            </button>

            <div className="task-content">
              <h4 className={task.completed ? 'task-title-completed' : 'task-title'}>
                {task.title}
              </h4>
              <div className="task-meta">
                <span className={`badge badge-${badge.color}`}>
                  {badge.label}
                </span>
                {task.dueDate && (
                  <span className="task-due">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <button
              className="task-delete"
              onClick={() => handleDelete(task._id)}
              title="Delete task"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;