import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import UserContext from "../context/UserContext";
import '../styles/myprofile.css'; // Import the CSS file

export default function MyProfile() {
  const { user } = useContext(UserContext); // Assuming you're using a user context
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // For password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Fetch user details from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:4000/users/details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data.user);
        } else {
          throw new Error("Failed to fetch profile details");
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch("http://localhost:4000/users/details", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          mobileNo: profileData.mobileNo,
        }),
      });

      if (response.ok) {
        setSuccess("Profile updated successfully");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/update-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordSuccess("Password updated successfully.");
        setShowPasswordModal(false);
      } else {
        throw new Error("Failed to update password.");
      }
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  // Handle input changes for profile and password
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  return (
    <div className="user-profile">
      <h2>Your Profile</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email (cannot be changed)</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={profileData.email}
            readOnly
            disabled
          />
        </Form.Group>

        <Form.Group controlId="formMobileNo">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            name="mobileNo"
            value={profileData.mobileNo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </Form>

      {/* Button to change password */}
      <Button variant="secondary" className="mt-3" onClick={() => setShowPasswordModal(true)}>
        Change Password
      </Button>

      {/* Modal for changing password */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordError && <p className="error-message">{passwordError}</p>}
          {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}
          <Form onSubmit={handlePasswordChange}>
            <Form.Group controlId="formCurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChangeInput}
                required
              />
            </Form.Group>

            <Form.Group controlId="formNewPassword" className="mt-2">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChangeInput}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mt-2">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChangeInput}
                required
              />
            </Form.Group>

            <Button  type="submit" className="mt-3 btn-green">
              Change Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
