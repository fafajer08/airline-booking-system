import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import NavBar from '../components/NavBar'; // Adjust the path according to your file structure
import '../styles/login.css'; // Ensure you have this CSS file for custom styles

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // State for visibility


  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ name, email, password, agree });
  };
  useEffect(() => {
    // Add visibility effect based on URL changes (optional, based on routing)
    if (window.location.pathname === "/login") {
      setIsVisible(true);
    }
  }, []);

  return (
    <>
      <Container fluid className="p-0">
        <Row className="g-0">
          {/* Hero Section */}
          <Col md={6} className="hero-image d-none d-md-flex">
            {/* Add your hero section image */}
          </Col>

          {/* Login Form */}
          <Col md={6} className={`d-flex align-items-center justify-content-center ${isVisible ? 'slide-in' : 'slide-out'}`}>
            <div className="login-form-container">
              <h2 className="text-start py-5">Get Started Now</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className='form-label'>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control-custom"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className='form-label'>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control-custom"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className='form-label'>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control-custom"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="I agree to the terms and Policy"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100 mb-3 btn-custom-signin">
                  Sign In
                </Button>
                <div className="text-center my-3">
                <div className="divider-container">
                    <hr className="divider-line" />
                    <span className="divider-text">or</span>
                    <hr className="divider-line" />
                  </div>
                </div>
                <div className="d-flex gap-3 mb-3">
                  <Button variant="outline-secondary" className="w-45 btn-custom d-flex align-items-center justify-content-center">
                    <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="me-2" style={{ maxHeight: '20px' }} />
                    Sign in with Google
                  </Button>
                  <Button variant="outline-secondary" className="w-45 btn-custom d-flex align-items-center justify-content-center">
                    <img src="https://img.icons8.com/ios-glyphs/30/mac-os.png" alt="Apple" className="me-2" style={{ maxHeight: '20px' }} />
                    Sign in with Apple
                  </Button>
                </div>
                <div className="text-center">
                  <span>Have an account?</span> <a href="/login">Sign In</a>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
