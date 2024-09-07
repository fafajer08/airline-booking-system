import React, { useState, useContext } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LoginWindow from './LoginWindow';
import SignupWindow from './SignupWindow';
import logo from '../images/logo.png';
import '../styles/navbar.css';
import UserContext from '../context/UserContext';

export default function NavBar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isSignupVisible, setSignupVisible] = useState(false);
  const [signupEmail, setSignupEmail] = useState(''); // Store the email from signup

  const openLoginWithEmail = (email) => {
    setSignupEmail(email);  // Store the email from signup
    setSignupVisible(false); // Ensure signup window is closed
    setLoginVisible(true);   // Open login window
  };

  // Show login window
  const handleLoginClick = () => {
    setLoginVisible(true);
    setSignupVisible(false); // Ensure the signup window is closed
  };

  // Show signup window
  const handleSignUpClick = () => {
    setSignupVisible(true);
    setLoginVisible(false); // Ensure the login window is closed
  };

  // Close login window
  const closeLoginWindow = () => setLoginVisible(false);

  // Close signup window
  const closeSignupWindow = () => setSignupVisible(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Navbar expand="lg" className="nav-bar bg-body-primary">
        <Container fluid>
          <Navbar.Brand className="nav-bar-brand d-flex align-items-center" as={Link} to="/">
            <img className="nav-bar-logo" src={logo} alt="Logo" />
            <span className="nav-bar-logo-name">Fly Airlines</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="nav-bar-toggler" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">

             
              {user && user.isAdmin ? (
                <>
                {/* Navbar for admin users */}
                  <Nav.Link as={Link} to="/admin" className="nav-bar-link me-3">Admin Control</Nav.Link>
                </>
              ) : (
                <>
                {/* Navbar for non-admin users */}
                  <Nav.Link as={Link} to="/searchflight" className="nav-bar-link me-3">Flights</Nav.Link>
                  <Nav.Link as={Link} to="#link" className="nav-bar-link me-3">Destinations</Nav.Link>
                  <Nav.Link as={Link} to="#link" className="nav-bar-link me-3">Deals</Nav.Link>
                  <Nav.Link as={Link} to="#link" className="nav-bar-link me-3">Bookings</Nav.Link>
                </>
              )}
              {user ? (
                <>
                  {/* Navbar for logged in users */}
                  <Nav.Link as={Link} to="/users" className="nav-bar-link me-3">My Profile</Nav.Link>
                  <Nav.Link onClick={handleLogout} className="nav-bar-link me-3">Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={handleLoginClick} className="nav-bar-link me-3">Account</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Conditionally show the overlay if either window is visible */}
      {(isLoginVisible || isSignupVisible) && (
        <div className={`modal-overlay ${isLoginVisible || isSignupVisible ? 'visible' : ''}`}></div>
      )}

      {/* Single LoginWindow with both props */}
      <LoginWindow
        isVisible={isLoginVisible}
        onClose={closeLoginWindow}
        handleSignUpClick={handleSignUpClick}
        initialEmail={signupEmail}
      />

      <SignupWindow
        isVisible={isSignupVisible}
        onClose={closeSignupWindow}
        openLoginWithEmail={openLoginWithEmail}
      />
    </>
  );
}
