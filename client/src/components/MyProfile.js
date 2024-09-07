import React, { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import UserContext from "../context/UserContext";

export default function MyProfile() {
  const { user } = useContext(UserContext); // Assuming you're using a user context
  const [profileData, setProfileData] = useState({
    firstName: "asdf",
    lastName: "asdf",
    email: "asdf@gmail.com",
    mobileNo: "12345678901",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // // Fetch user details from the backend
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     setLoading(true);
  //     setError("");
  //     try {
  //       const response = await fetch("http://localhost:4000/users/details", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming the token is stored in localStorage
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setProfileData(data.user); // Assuming the user details are under 'user'
  //       } else {
  //         throw new Error("Failed to fetch profile details");
  //       }
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //     setLoading(false);
  //   };

  //   fetchProfile();
  // }, []);

  // // Handle form submission to update profile
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");
  //   setSuccess("");
    
  //   try {
  //     const response = await fetch("/users/details", {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming the token is stored in localStorage
  //       },
  //       body: JSON.stringify({
  //         firstName: profileData.firstName,
  //         lastName: profileData.lastName,
  //         mobileNo: profileData.mobileNo,
  //       }),
  //     });

  //     if (response.ok) {
  //       setSuccess("Profile updated successfully");
  //     } else {
  //       throw new Error("Failed to update profile");
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //   }
  //   setLoading(false);
  // };

  // // Handle input changes
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setProfileData({
  //     ...profileData,
  //     [name]: value,
  //   });
  // };

  return (
    <div className="user-profile">
      <h2>Your Profile</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {/* onSubmit={handleSubmit} */}
      <Form >
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          {/* <Form.Control
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
            required
          /> */}
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          {/* <Form.Control
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
            required
          /> */}
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email (cannot be changed)</Form.Label>
          {/* <Form.Control
            type="email"
            name="email"
            value={profileData.email}
            readOnly
            disabled
          /> */}
        </Form.Group>

        <Form.Group controlId="formMobileNo">
          <Form.Label>Mobile Number</Form.Label>
          {/* <Form.Control
            type="text"
            name="mobileNo"
            value={profileData.mobileNo}
            onChange={handleChange}
            required
          /> */}
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </Form>
    </div>
  );
}
