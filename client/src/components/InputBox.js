import React, { useState } from 'react';
import '../styles/inputbox.css';

function InputBox({ label, onChange, placeholder = "Enter text here" }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="inputbox-outer-container">
      {label && <p className="inputbox-code-label">{label}</p>} {/* Render label only if provided */}
      <div className="inputbox-inner-container">
        <input
          type="text"
          className="inputbox-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default InputBox;
