import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signupwindow.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

function SignupWindow({ isVisible, onClose, openLoginWithEmail }) {

  const notyf = new Notyf({
    duration: 3000, // Duration in milliseconds (optional, default is 2000)
    position: {
      x: 'right',   // Position horizontally
      y: 'top',     // Position vertically
    },
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // For navigation

  // Reset fields when the modal is opened or closed
  useEffect(() => {
    if (!isVisible) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhoneNo('');
      setError('');
    }
  }, [isVisible]);

  // Handle form submission
  const handleSignUp = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (phoneNo.length !== 11 || isNaN(phoneNo)) {
      setError('Phone number must be 11 digits long');
      return;
    }

    setLoading(true);
    setError('');

    // Sign up logic here
    fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phoneNo,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.message === "Registered Successfully") {
          notyf.success(data.message);
          onClose();
          openLoginWithEmail(email); // Open login with pre-filled email
        } else {
          setError(data.message || data.error || 'Sign up failed. Please try again.');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError('Sign up failed. Please try again.');
      });
  };

  return (
    <div className={`signup-window ${isVisible ? 'visible' : ''}`}>
      <div className="close-btn-container">
        <button onClick={onClose} className="btn-close">&times;</button>
      </div>
      <div className="signup-window-content">
        <h2>Create Your Account</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your first name"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter your last name"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="signup-email"
              id="signup-email"
              placeholder="Enter your email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNo">Phone Number</label>
            <input
              type="tel"
              name="phoneNo"
              id="phoneNo"
              placeholder="Enter your 11-digit phone number"
              className="form-control"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="signup-password"
              id="signup-password"
              placeholder="Enter your password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>



          <button type="submit" className="btn btn-primary signup-btn" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupWindow;
