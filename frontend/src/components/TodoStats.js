import React from 'react';
import './TodoStats.css';

function TodoStats({ stats }) {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <span className="stat-number">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{stats.active}</span>
        <span className="stat-label">Active</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{stats.completed}</span>
        <span className="stat-label">Completed</span>
      </div>
    </div>
  );
}

export default TodoStats;

