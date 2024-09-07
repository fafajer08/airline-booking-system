import React from 'react';
import NavBar from "../components/NavBar";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import cebu from '../images/cebu.jpg';
import bohol from '../images/bohol.webp';
import coron from '../images/coron.jpg';
import bgc from '../images/bgc.jpg';


export default function Destinations() {
  return (

<div>
<NavBar />

  	<Container className="mt-5">
  		<h3><strong>Your Next Vacation</strong></h3>
  		<p class="text-muted">Tempora facere doloribus id aut. Ea maiores esse accusantium laboriosam. Quos commodi non assumenda quam illum. Id omnis saepe corrupti incidunt qui sed delectus. Eaque minus ducimus.</p>

  		<Row className="justify-content-sm-center">
  			
  			<Col>
  				<Card style={{ width: '19rem'}} className ='border-0 rounded-4'>
  				      <Card.Img className="rounded-4 my-3" variant="top" src={cebu}  width={280} height={250} />
  				   <Card.Body>
  				       <div className="d-flex justify-content-between align-items-center">
  				         <Card.Title style={{ marginBottom: '0' }}>Cebu</Card.Title>
  				         <div className="d-flex align-items-center">
  				           <i className="bi bi-star-fill" style={{ color: 'black' }}></i>
  				           <span style={{ marginLeft: '5px' }}>4.92</span>
  				         </div>
  				       </div>
  				       <Card.Text style={{ marginTop: '10px' }}>
  				         Voluptatibus Nemo Amet Voluptatem Quia Ipsa Eum. Est Ut Voluptas.
  				       </Card.Text>
  				     </Card.Body>
  				    </Card>
  			</Col>

  			<Col>
  				<Card style={{ width: '19rem'}} className ='border-0 rounded-4'>
  				      <Card.Img className="rounded-4 my-3" variant="top" src={coron}  width={280} height={250} />
  				      <Card.Body>
  				       <div className="d-flex justify-content-between align-items-center">
  				         <Card.Title style={{ marginBottom: '0' }}>Coron</Card.Title>
  				         <div className="d-flex align-items-center">
  				           <i className="bi bi-star-fill" style={{ color: 'black' }}></i>
  				           <span style={{ marginLeft: '5px' }}>4.92</span>
  				         </div>
  				       </div>
  				       <Card.Text style={{ marginTop: '10px' }}>
  				         Voluptatibus Nemo Amet Voluptatem Quia Ipsa Eum. Est Ut Voluptas.
  				       </Card.Text>
  				     </Card.Body>
  				    </Card>
  			</Col>

  			<Col>
  				<Card style={{ width: '19rem'}} className ='border-0 rounded-4'>
  				      <Card.Img className="rounded-4 my-3" variant="top" src={bohol}  width={280} height={250} />
  				      <Card.Body>
  				       <div className="d-flex justify-content-between align-items-center">
  				         <Card.Title style={{ marginBottom: '0' }}>Bohol</Card.Title>
  				         <div className="d-flex align-items-center">
  				           <i className="bi bi-star-fill" style={{ color: 'black' }}></i>
  				           <span style={{ marginLeft: '5px' }}>4.92</span>
  				         </div>
  				       </div>
  				       <Card.Text style={{ marginTop: '10px' }}>
  				         Voluptatibus Nemo Amet Voluptatem Quia Ipsa Eum. Est Ut Voluptas.
  				       </Card.Text>
  				     </Card.Body>
  				    </Card>
  			</Col>

  			<Col>
  				<Card style={{ width: '19rem'}} className ='border-0 rounded-4'>
  				      <Card.Img className="rounded-4 my-3" variant="top" src={bgc}  width={280} height={250} />
  				      <Card.Body>
  				       <div className="d-flex justify-content-between align-items-center">
  				         <Card.Title style={{ marginBottom: '0' }}>BGC</Card.Title>
  				         <div className="d-flex align-items-center">
  				           <i className="bi bi-star-fill" style={{ color: 'black' }}></i>
  				           <span style={{ marginLeft: '5px' }}>4.92</span>
  				         </div>
  				       </div>
  				       <Card.Text style={{ marginTop: '10px' }}>
  				         Voluptatibus Nemo Amet Voluptatem Quia Ipsa Eum. Est Ut Voluptas.
  				       </Card.Text>
  				     </Card.Body>
  				    </Card>
  			</Col>


  		</Row>
  	</Container>
</div> 
  
  );
}