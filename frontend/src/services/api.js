import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = API_URL;

// Dashboard
export const getDashboard = async () => {
  const { data } = await axios.get('/api/dashboard');
  return data;
};

// Studies
export const addStudy = async (studyData) => {
  const { data } = await axios.post('/api/studies', studyData);
  return data;
};

export const getStudies = async () => {
  const { data } = await axios.get('/api/studies');
  return data;
};

export const getTodayStudies = async () => {
  const { data } = await axios.get('/api/studies/today');
  return data;
};

export const getWeeklyStats = async () => {
  const { data } = await axios.get('/api/studies/weekly');
  return data;
};

export const deleteStudy = async (id) => {
  const { data } = await axios.delete(`/api/studies/${id}`);
  return data;
};

// Tasks
export const addTask = async (taskData) => {
  const { data } = await axios.post('/api/tasks', taskData);
  return data;
};

export const getTasks = async () => {
  const { data } = await axios.get('/api/tasks');
  return data;
};

export const getPendingTasks = async () => {
  const { data } = await axios.get('/api/tasks/pending');
  return data;
};

export const getCompletedTasks = async () => {
  const { data } = await axios.get('/api/tasks/completed');
  return data;
};

export const toggleTask = async (id) => {
  const { data } = await axios.put(`/api/tasks/${id}/toggle`);
  return data;
};

export const updateTask = async (id, taskData) => {
  const { data } = await axios.put(`/api/tasks/${id}`, taskData);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await axios.delete(`/api/tasks/${id}`);
  return data;
};

export const getTaskStats = async () => {
  const { data } = await axios.get('/api/tasks/stats');
  return data;
};