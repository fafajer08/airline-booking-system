import React, { useState, useContext } from 'react';
import '../styles/loginwindow.css';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext.js';

function LoginWindow({ isVisible, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext); // Get login function from UserContext

  // Function to handle form submission
  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous errors
  
    fetch('http://localhost:4000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          // If the response is not OK, throw an error to catch in the next block
          return res.json().then((err) => {
            throw new Error(err.message || 'Login failed. Please try again.');
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.access) {
          localStorage.setItem('token', data.access);
          setEmail('');
          setPassword('');
          retrieveUserDetails(data.access);
        } else {
          setError(data.message || 'Login failed. Please try again.');
          setLoading(false);
        }
      })
      .catch((error) => {
        // Log the error message and update the UI with an error message
        console.error('Login error:', error);
        setError(error.message || 'An error occurred. Please try again.');
        setLoading(false);
      });
  };
  
  const retrieveUserDetails = (token) => {
    fetch('http://localhost:4000/users/details', {
      method: 'GET',
      headers: { 
        Authorization: `Bearer ${token}` // Ensure proper format of Bearer token
      },
    })
      .then((res) => {
        if (!res.ok) {
          // If response is not OK, log and throw an error
          return res.json().then((err) => {
            throw new Error(err.message || 'Failed to retrieve user details.');
          });
        }
        return res.json(); // Parse JSON response if OK
      })
      .then((data) => {
        if (data._id) {
          // Call the login function from UserContext to update the user state
          login({
            id: data._id,
            firstName: data.firstName,
            isAdmin: data.isAdmin,
            email: data.email,
          });
  
          // Navigate to the appropriate dashboard
          if (data.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/users');
          }
  
          setLoading(false); // Stop loading after navigation
          onClose(); // Optionally close the login window after navigating
        } else {
          setError('User details not found.'); // Handle missing data
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error); // Log error for debugging
        setError(error.message || 'Failed to retrieve user details.');
        setLoading(false); // Stop loading on error
      });
  };
  
  return (
    <div className={`login-window ${isVisible ? 'visible' : ''}`}>
      <div className="close-btn-container">
        <button onClick={onClose} className="btn-close">&times;</button>
      </div>
      <div className="login-window-content">
        <h2>Login to Your Account</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
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
              autoComplete="email"
            />
          </div>
          {/* <div className="form-group">
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
          </div> */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
                <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Enter your password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button
                type="button" /* Explicitly set the button type to "button" */
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-btn"
                >
                {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
          </div>

          <div className="form-check">
            <input type="checkbox" id="remember" name="remember" className="form-check-input" />
            <label htmlFor="remember" className="form-check-label">Remember me</label>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="separator">
          <span>Or</span>
        </div>

        <div className="social-login">
          <button className="btn btn-google" disabled={loading}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" alt="Google" />
            Login with Google
          </button>
          <button className="btn btn-apple" disabled={loading}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
            Login with Apple
          </button>
        </div>

        <div className="signup-link">
          <span>Don't have an account? <a href="#signup">Sign Up</a></span>
        </div>
      </div>
    </div>
  );
}

export default LoginWindow;
