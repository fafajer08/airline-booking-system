import React, { useState, useContext } from "react";
import MyProfile from "../components/MyProfile";  // Import UserProfile component
import UserContext from "../context/UserContext";

export default function Users() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <div className="d-flex align-content-center justify-content-center">
        <div className="container">
          <h5 className="mt-5 ms-5 px-5">My Profile</h5>
          <h2 className="ms-5 px-5">Welcome {user.firstName || 'Guest'}</h2>

          {/* Render the UserProfile component */}
          <div className="d-flex align-content-center justify-content-center">
            <MyProfile />
          </div>
        </div>
      </div>
    </div>
  );
}
