import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilters from './components/TodoFilters';
import TodoStats from './components/TodoStats';
import ErrorMessage from './components/ErrorMessage';
import * as todoService from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    completed: 'all',
    priority: 'all'
  });

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoService.getTodos(filters);
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Error connecting to server');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (todoData) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      return true;
    } catch (err) {
      setError(err.message || 'Error creating todo');
      return false;
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, updates);
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err.message || 'Error updating todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.message || 'Error deleting todo');
    }
  };

  const handleToggleComplete = async (id) => {
    const todo = todos.find(t => t._id === id);
    if (todo) {
      await handleUpdateTodo(id, { completed: !todo.completed });
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>TODO Application</h1>
          <p className="subtitle">Manage your tasks efficiently</p>
        </header>

        <TodoStats stats={stats} />

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        <TodoForm onAddTodo={handleAddTodo} />

        <TodoFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {loading && <div className="loading">Loading todos...</div>}

        {!loading && (
          <TodoList
            todos={todos}
            onToggleComplete={handleToggleComplete}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>
    </div>
  );
}

export default App;

