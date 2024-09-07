import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link for routing
import '../styles/navbar.css';
import logo from '../images/logo.png';

export default function NavBar() {
  return (
    <Navbar expand="lg" className="nav bg-body-primary">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center" as={Link} to="/">
          <img className='logo' src={logo} alt="Logo" />
          <span className='logo-name'>Fly Airlines</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/destinations" className='me-3'>Destinations</Nav.Link>
            <Nav.Link as={Link} to="/searchflight" className='me-3'>Flights</Nav.Link>
            <Nav.Link as={Link} to="#link" className='me-3'>Destinations</Nav.Link>
            <Nav.Link as={Link} to="#link" className='me-3'>Deals</Nav.Link>
            <Nav.Link as={Link} to="#link" className='me-3'>My Bookings</Nav.Link>
            <Nav.Link as={Link} to="/login" className='me-3'>Account</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
