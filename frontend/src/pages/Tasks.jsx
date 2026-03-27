import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import { getTasks, addTask } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, ListTodo } from 'lucide-react';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'other',
    dueDate: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      await addTask(newTask);
      toast.success('Task added successfully');
      setNewTask({ title: '', category: 'other', dueDate: '' });
      setShowAddForm(false);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

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

  return (
    <div className="page">
      <Navbar />
      
      <div className="container tasks-container">
        <div className="page-header fade-in">
          <div>
            <h1>My Tasks</h1>
            <p className="page-subtitle">Manage your assignments and to-dos</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        {showAddForm && (
          <div className="card add-task-form slide-in">
            <h3>New Task</h3>
            <form onSubmit={handleAddTask}>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="title">Task Title *</label>
                  <input
                    id="title"
                    type="text"
                    className="input"
                    placeholder="e.g., Complete DSA Assignment"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="input"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  >
                    <option value="assignment">Assignment</option>
                    <option value="coding practice">Coding Practice</option>
                    <option value="exam prep">Exam Prep</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="dueDate">Due Date (Optional)</label>
                  <input
                    id="dueDate"
                    type="date"
                    className="input"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="tasks-sections">
          {pendingTasks.length > 0 && (
            <div className="card fade-in">
              <div className="section-header">
                <div className="section-title">
                  <ListTodo size={20} />
                  <h3>Pending</h3>
                  <span className="count-badge">{pendingTasks.length}</span>
                </div>
              </div>
              <TaskList tasks={pendingTasks} onUpdate={fetchTasks} />
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="card fade-in">
              <div className="section-header">
                <div className="section-title">
                  <ListTodo size={20} />
                  <h3>Completed</h3>
                  <span className="count-badge">{completedTasks.length}</span>
                </div>
              </div>
              <TaskList tasks={completedTasks} onUpdate={fetchTasks} />
            </div>
          )}

          {tasks.length === 0 && !showAddForm && (
            <div className="empty-state-large card">
              <h3>No tasks yet</h3>
              <p>Start by adding your first task</p>
              <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                <Plus size={20} />
                Add Your First Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;