import React, { useState } from 'react';

// Create the context
const UserContext = React.createContext();

// Create the UserProvider component that will manage and provide the user state
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initial state for the user, null means no user is logged in

  // Function to log the user in (updates the user state)
  const login = (userData) => {
    setUser(userData); // Update the user state with the logged-in user's data
  };

  // Function to log the user out (clears the user state)
  const logout = () => {
    setUser(null); // Set the user state to null, meaning no user is logged in
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
export { UserProvider } ;
