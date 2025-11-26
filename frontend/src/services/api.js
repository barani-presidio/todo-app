import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const getTodos = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('sortBy', 'createdAt');
    params.append('order', 'desc');

    if (filters.completed !== 'all') {
      params.append('completed', filters.completed === 'completed');
    }

    if (filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }

    const response = await api.get(`/todos?${params.toString()}`);
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

export const getTodoById = async (id) => {
  try {
    const response = await api.get(`/todos/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createTodo = async (todoData) => {
  try {
    const response = await api.post('/todos', todoData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateTodo = async (id, updates) => {
  try {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

