import React from 'react';
import './TodoFilters.css';

function TodoFilters({ filters, onFilterChange }) {
  return (
    <div className="todo-filters">
      <div className="filter-group">
        <label>Status:</label>
        <div className="filter-buttons">
          {['all', 'active', 'completed'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filters.completed === status ? 'active' : ''}`}
              onClick={() => onFilterChange('completed', status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Priority:</label>
        <div className="filter-buttons">
          {['all', 'low', 'medium', 'high'].map((priority) => (
            <button
              key={priority}
              className={`filter-btn ${filters.priority === priority ? 'active' : ''}`}
              onClick={() => onFilterChange('priority', priority)}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TodoFilters;

