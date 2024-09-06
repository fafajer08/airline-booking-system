import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signupwindow.css';

function SignupWindow({ isVisible, onClose, openLoginWithEmail }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
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
      setMobileNo('');
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

    if (mobileNo.length !== 11 || isNaN(mobileNo)) {
      setError('Phone number must be 11 digits long');
      return;
    }

    setLoading(true);
    setError('');

    // Sign up logic here
    fetch('http://localhost:4000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        mobileNo,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.message === "Registered Successfully") {
          // Close the signup window and open login window with email pre-filled
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
              name="email"
              id="email"
              placeholder="Enter your email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
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

          <div className="form-group">
            <label htmlFor="mobileNo">Phone Number</label>
            <input
              type="tel"
              name="mobileNo"
              id="mobileNo"
              placeholder="Enter your 11-digit phone number"
              className="form-control"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
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
