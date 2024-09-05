import React from 'react';
import '../styles/promptmodal.css'; // Import CSS for styling

function PromptModal({ title, message, buttonText, onClose }) {
  return (
    <div className="prompt-modal-overlay">
      <div className="prompt-modal-content">
        <div className="icon-container">
          <div className="success-icon">&#10004;</div> {/* Checkmark icon */}
        </div>
        <h2 className="prompt-title">{title}</h2>
        <p className="prompt-message">{message}</p>
        <button className="prompt-button" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default PromptModal;
