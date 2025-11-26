import React from 'react';
import './ErrorMessage.css';

function ErrorMessage({ message, onClose }) {
  return (
    <div className="error-container">
      <div className="error-message">
        {message}
        <button onClick={onClose} className="close-btn">
          ×
        </button>
      </div>
    </div>
  );
}

export default ErrorMessage;

