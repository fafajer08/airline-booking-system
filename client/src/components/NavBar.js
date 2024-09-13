// import React, { useState, useContext } from 'react';
// import { Container, Nav, Navbar } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import LoginWindow from './LoginWindow';
// import SignupWindow from './SignupWindow';
// import logo from '../images/logo.png';
// import '../styles/navbar.css';
// import UserContext from '../context/UserContext';

// export default function NavBar() {
//   const { user, logout } = useContext(UserContext);
//   const navigate = useNavigate();

//   const [isLoginVisible, setLoginVisible] = useState(false);
//   const [isSignupVisible, setSignupVisible] = useState(false);
//   const [signupEmail, setSignupEmail] = useState(''); // Store the email from signup

//   const openLoginWithEmail = (email) => {
//     setSignupEmail(email);  // Store the email from signup
//     setSignupVisible(false); // Ensure signup window is closed
//     setLoginVisible(true);   // Open login window
//   };

//   // Toggle windows
//   const handleLoginClick = () => {
//     setLoginVisible(true);
//     setSignupVisible(false);
//   };

//   const handleSignUpClick = () => {
//     setSignupVisible(true);
//     setLoginVisible(false);
//   };

//   const closeLoginWindow = () => setLoginVisible(false);
//   const closeSignupWindow = () => setSignupVisible(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   // Function to get links based on the user's state
//   const renderNavLinks = () => {
//     // if user is logged in and addmin
//     if (user && user.isAdmin) {
//       return (
//         <>
//           <Nav.Link as={Link} to="/admin/create" className="nav-bar-link me-3">Create Flights</Nav.Link>
//           <Nav.Link as={Link} to="/admin/control" className="nav-bar-link me-3">Flights Control</Nav.Link>
//           <Nav.Link as={Link} to="/admin/page" className="nav-bar-link me-3">Page Control</Nav.Link>
//         </>
//       );
//     // if user is logged in
//     } else if (user) {
//       return (
//         <>
//           {/* <Nav.Link as={Link} to="/" className="nav-bar-link me-3">Home</Nav.Link> */}
//           <Nav.Link as={Link} to="/flights" className="nav-bar-link me-3">Flights</Nav.Link>
//           {/* <Nav.Link as={Link} to="/destinations" className="nav-bar-link me-3">Destinations</Nav.Link> */}
//           <Nav.Link as={Link} to="/deals" className="nav-bar-link me-3">Deals</Nav.Link>
//           <Nav.Link as={Link} to="/mybookings" className="nav-bar-link me-3">My Bookings</Nav.Link>
//         </>
//       );
//     } else {
//       // if use is not logged in
//       return (
//         <>
//           <Nav.Link as={Link} to="/" className="nav-bar-link me-3">Home</Nav.Link>
//           <Nav.Link as={Link} to="/#" className="nav-bar-link me-3">Flights</Nav.Link>
//           <Nav.Link as={Link} to="/destinations" className="nav-bar-link me-3">Destinations</Nav.Link>
//           <Nav.Link as={Link} to="/deals" className="nav-bar-link me-3">Deals</Nav.Link>
//         </>
//       );
//     }
//   };

//   // Render buttons based on user state
//   const renderUserActions = () => {
//     if (user) {
//       return (
//         <>
//           <Nav.Link as={Link} to="/profile" className="nav-bar-link me-3">My Profile</Nav.Link>
//           <Nav.Link onClick={handleLogout} className="nav-bar-link me-3">Logout</Nav.Link>
//         </>
//       );
//     } else {
//       return <Nav.Link onClick={handleLoginClick} className="nav-bar-link me-3">Account</Nav.Link>;
//     }
//   };

//   return (
//     <>
//       <Navbar expand="lg" className="nav-bar bg-body-primary">
//         <Container fluid>
//           <Navbar.Brand className="d-flex align-items-center" as={Link} to="/">
//             <img className="nav-bar-logo" src={logo} alt="Logo" />
//             <span className="nav-bar-logo-name">Fly Airlines</span>
//           </Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" className="nav-bar-toggler" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ms-auto">
//               {renderNavLinks()}
//               {renderUserActions()}
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Conditionally show the overlay if either window is visible */}
//       {(isLoginVisible || isSignupVisible) && (
//         <div className={`modal-overlay ${isLoginVisible || isSignupVisible ? 'visible' : ''}`}></div>
//       )}

//       {/* Single LoginWindow with both props */}
//       <LoginWindow
//         isVisible={isLoginVisible}
//         onClose={closeLoginWindow}
//         handleSignUpClick={handleSignUpClick}
//         initialEmail={signupEmail}
//       />

//       <SignupWindow
//         isVisible={isSignupVisible}
//         onClose={closeSignupWindow}
//         openLoginWithEmail={openLoginWithEmail}
//       />
//     </>
//   );
// }

import React, { useState, useContext } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
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
  const [isNightMode, setIsNightMode] = useState(false); // State for night mode

  const openLoginWithEmail = (email) => {
    setSignupEmail(email);  // Store the email from signup
    setSignupVisible(false); // Ensure signup window is closed
    setLoginVisible(true);   // Open login window
  };

  // Toggle windows
  const handleLoginClick = () => {
    setLoginVisible(true);
    setSignupVisible(false);
  };

  const handleSignUpClick = () => {
    setSignupVisible(true);
    setLoginVisible(false);
  };

  const closeLoginWindow = () => setLoginVisible(false);
  const closeSignupWindow = () => setSignupVisible(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Toggle night mode
  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
    document.body.classList.toggle('night-mode');
  };

  // Function to get links based on the user's state
  const renderNavLinks = () => {
    if (user && user.isAdmin) {
      return (
        <>
          <Nav.Link as={Link} to="/admin/create" className="nav-bar-link me-3">Create Flights</Nav.Link>
          <Nav.Link as={Link} to="/admin/control" className="nav-bar-link me-3">Flights Control</Nav.Link>
          <Nav.Link as={Link} to="/admin/page" className="nav-bar-link me-3">Page Control</Nav.Link>
        </>
      );
    } else if (user) {
      return (
        <>
          <Nav.Link as={Link} to="/flights" className="nav-bar-link me-3">Flights</Nav.Link>
          <Nav.Link as={Link} to="/deals" className="nav-bar-link me-3">Deals</Nav.Link>
          <Nav.Link as={Link} to="/mybookings" className="nav-bar-link me-3">My Bookings</Nav.Link>
        </>
      );
    } else {
      return (
        <>
          <Nav.Link as={Link} to="/" className="nav-bar-link me-3">Home</Nav.Link>
          <Nav.Link as={Link} to="/#" className="nav-bar-link me-3">Flights</Nav.Link>
          <Nav.Link as={Link} to="/destinations" className="nav-bar-link me-3">Destinations</Nav.Link>
          <Nav.Link as={Link} to="/deals" className="nav-bar-link me-3">Deals</Nav.Link>
        </>
      );
    }
  };

  // Render buttons based on user state
  const renderUserActions = () => {
    if (user) {
      return (
        <>
          <Nav.Link as={Link} to="/profile" className="nav-bar-link me-3">My Profile</Nav.Link>
          <Nav.Link onClick={handleLogout} className="nav-bar-link me-3">Logout</Nav.Link>
        </>
      );
    } else {
      return <Nav.Link onClick={handleLoginClick} className="nav-bar-link me-3">Account</Nav.Link>;
    }
  };

  return (
    <>
     <Navbar expand="lg" className={`nav-bar bg-body-primary ${isNightMode ? 'night-mode' : ''}`}>
  <Container fluid>
    <Navbar.Brand className="d-flex align-items-center" as={Link} to="/">
      <img className="nav-bar-logo" src={logo} alt="Logo" />
      <span className="nav-bar-logo-name">Fly Airlines</span>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" className="nav-bar-toggler" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto d-flex align-items-center">
        {renderNavLinks()}
        {renderUserActions()}
        {/* Night Mode Toggle Icon */}
        <Button
          onClick={toggleNightMode}
          className="night-mode-btn ms-3"
          variant="link"
          aria-label={isNightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
        >
          <span className="material-icons">
            {isNightMode ? 'brightness_7' : 'brightness_4'}
          </span>
        </Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>


      {(isLoginVisible || isSignupVisible) && (
        <div className={`modal-overlay ${isLoginVisible || isSignupVisible ? 'visible' : ''}`}></div>
      )}

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
