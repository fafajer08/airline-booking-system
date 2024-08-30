import {Logo, Container, Nav, Navbar} from 'react-bootstrap'
import '../styles/navbar.css'
import logo from '../images/logo.png'


export default function NavBar() {
  return (
    <div>
      <Navbar expand="lg" className="nav bg-body-primary">
      <Container>
      <img className='logo'
          src={logo} 
          alt="Logo"
       />

        <Navbar.Brand className='logo-name' href="#home">Fly Airlines</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" className='me-3'>Flights</Nav.Link>
            <Nav.Link href="#link" className='me-3'>Destinations</Nav.Link>
            <Nav.Link href="#link" className='me-3'>Deals</Nav.Link>
            <Nav.Link href="#link" className='me-3'>My Bookings</Nav.Link>
            <Nav.Link href="#link" className='me-3'>Account</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  );
}

