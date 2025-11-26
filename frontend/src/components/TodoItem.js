import React, { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onToggleComplete, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdateTodo(todo._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}>
      {!isEditing ? (
        <div className="todo-view">
          <div className="todo-checkbox">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleComplete(todo._id)}
              id={`todo-${todo._id}`}
            />
            <label htmlFor={`todo-${todo._id}`}></label>
          </div>

          <div className="todo-content">
            <div className="todo-header">
              <h3 className="todo-title">{todo.title}</h3>
              <span className={`priority-badge ${todo.priority}`}>
                {todo.priority}
              </span>
            </div>
            {todo.description && (
              <p className="todo-description">{todo.description}</p>
            )}
            <div className="todo-meta">
              <span className="todo-date">{formatDate(todo.createdAt)}</span>
            </div>
          </div>

          <div className="todo-actions">
            <button
              onClick={() => setIsEditing(true)}
              className="action-btn edit-btn"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => onDeleteTodo(todo._id)}
              className="action-btn delete-btn"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      ) : (
        <div className="todo-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-title-input"
            maxLength="200"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
            className="edit-description-input"
            maxLength="500"
            rows="2"
          />
          <div className="edit-priority">
            {['low', 'medium', 'high'].map((p) => (
              <button
                key={p}
                type="button"
                className={`priority-btn ${p} ${editPriority === p ? 'active' : ''}`}
                onClick={() => setEditPriority(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoItem;

