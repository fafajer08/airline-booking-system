import React, { useState, useEffect } from "react";
import '../styles/modalprompt.css';

export default function ModalPrompt({ isVisible, onClose, apiUrl, method, needsAuth, data, fieldsConfig }) {
  const [formData, setFormData] = useState(data || {});

  // Sync formData when data changes (e.g., during editing)
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (needsAuth) {
      headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    }

    try {
      const response = await fetch(apiUrl, {
        method: method || "POST",
        headers: headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      alert("Request successful!");
      onClose(); // Close the modal after successful request
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data.");
    }
  };

  if (!isVisible) return null; // If modal is not visible, return null

  return (
    <div className={`modal ${isVisible ? '' : 'hidden'}`}>
      <div className="modal-content">
        <h2>{method === "PUT" ? "Edit Entry" : "Add Entry"}</h2>

        {fieldsConfig.map((field, index) => (
          <label key={index}>
            {field.label}:
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
              >
                {field.options.map((option, i) => (
                  <option key={i} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
              />
            )}
          </label>
        ))}

        <div className="modal-buttons">
          <button onClick={handleSubmit}>
            {method === "PUT" ? "Update" : "Submit"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
