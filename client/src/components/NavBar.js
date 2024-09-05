import React, { useState, useContext } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LoginWindow from './LoginWindow';
import logo from '../images/logo.png';
import '../styles/navbar.css';
import UserContext from '../context/UserContext';

export default function NavBar() {
  const { user, logout } = useContext(UserContext); // Get user and logout from UserContext

  const navigate = useNavigate(); // Use the navigate hook to navigate to different routes

  const [isLoginVisible, setLoginVisible] = useState(false);

  const handleLoginClick = () => {
    setLoginVisible(true); // Show the LoginWindow
  };

  const closeLoginWindow = () => {
    setLoginVisible(false); // Hide the LoginWindow
  };

  const handleLogout = () => {
    logout(); // Call the logout function from UserContext to clear the user
    navigate('/');

  };

  console.log(user ? user.id : 'No user logged in'); // Safely log user ID or a message

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
              <Nav.Link as={Link} to="/searchflight" className="nav-bar-link me-3">Flights</Nav.Link>
              <Nav.Link as={Link} to="#link" className="nav-bar-link me-3">Destinations</Nav.Link>
              <Nav.Link as={Link} to="#link" className="nav-bar-link me-3">Deals</Nav.Link>
              <Nav.Link as={Link} to="#link" className="nav-bar-link me-3">My Bookings</Nav.Link>
              {user ? (
                <>
                  <Nav.Link as={Link} to="#link" className="nav-bar-link me-3">Profile</Nav.Link>
                  <Nav.Link onClick={handleLogout} className="nav-bar-link me-3">Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={handleLoginClick} className="nav-bar-link me-3">Account</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LoginWindow isVisible={isLoginVisible} onClose={closeLoginWindow} />
    </>
  );
}
