// context/UserContext.js
import React, { useState, useEffect } from 'react';

// Create the context
const UserContext = React.createContext();

// Create the UserProvider component that will manage and provide the user state
const UserProvider = ({ children }) => {
  // Initialize the user state from localStorage (if available)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to log the user in (updates the user state and localStorage)
  const login = (userData) => {
    setUser(userData); // Update the user state
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
  };

  // Function to log the user out (clears the user state and localStorage)
  const logout = () => {
    setUser(null); // Set the user state to null
    localStorage.removeItem('user'); // Remove user data from localStorage
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
export { UserProvider };
