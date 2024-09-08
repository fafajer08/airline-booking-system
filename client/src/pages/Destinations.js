import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavBar from "../components/NavBar";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import cebu from '../images/cebu.jpg';
import bohol from '../images/bohol.webp';
import coron from '../images/coron.jpg';
import bgc from '../images/bgc.jpg';

export default function Destinations() {
  const navigate = useNavigate();

  // Function to handle card click and navigate to details page
  const handleCardClick = (destination) => {
    navigate(`/details/${destination}`);
  };

  return (
    <div>
      <Container className="mt-5">
        <h3><strong>Your Next Vacation</strong></h3>
        <p className="text-muted">Find the perfect destination for your next trip!</p>

        <Row className="justify-content-sm-center">
          <Col>
            <Card style={{ width: '19rem' }} className="border-0 rounded-4" onClick={() => handleCardClick('Cebu')}>
              <Card.Img className="rounded-4 my-3" variant="top" src={cebu} width={280} height={250} />
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>Cebu</Card.Title>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-star-fill" style={{ color: 'black' }}></i>
                    <span style={{ marginLeft: '5px' }}>4.92</span>
                  </div>
                </div>
                <Card.Text>Discover the beauty of Cebu with its amazing islands and rich culture.</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: '19rem' }} className="border-0 rounded-4" onClick={() => handleCardClick('Coron')}>
              <Card.Img className="rounded-4 my-3" variant="top" src={coron} width={280} height={250} />
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>Coron</Card.Title>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-star-fill" style={{ color: 'black' }}></i>
                    <span style={{ marginLeft: '5px' }}>4.92</span>
                  </div>
                </div>
                <Card.Text>Coron is famous for its crystal-clear waters and stunning limestone formations.</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: '19rem' }} className="border-0 rounded-4" onClick={() => handleCardClick('Bohol')}>
              <Card.Img className="rounded-4 my-3" variant="top" src={bohol} width={280} height={250} />
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>Bohol</Card.Title>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-star-fill" style={{ color: 'black' }}></i>
                    <span style={{ marginLeft: '5px' }}>4.92</span>
                  </div>
                </div>
                <Card.Text>Bohol offers beautiful beaches, the famous Chocolate Hills, and more.</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: '19rem' }} className="border-0 rounded-4" onClick={() => handleCardClick('BGC')}>
              <Card.Img className="rounded-4 my-3" variant="top" src={bgc} width={280} height={250} />
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>BGC</Card.Title>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-star-fill" style={{ color: 'black' }}></i>
                    <span style={{ marginLeft: '5px' }}>4.92</span>
                  </div>
                </div>
                <Card.Text>Experience the urban luxury of BGC with top restaurants and attractions.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
