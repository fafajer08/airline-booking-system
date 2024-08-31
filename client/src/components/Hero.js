// import { Carousel } from 'react-bootstrap';
// import Img from '../images/hero.png';
// import Img2 from '../images/hero-2.png';
// import Img3 from '../images/hero-3.png';
// import '../styles/hero.css';

// export default function HeroCarousel() {
//   return (
//     <div className="hero-carousel">
//       <Carousel className="carousel-fade">
//         <Carousel.Item>
//           <img
//             className="d-block w-100"
//             src={Img}
//             alt="First slide"
//           />
//           <Carousel.Caption className="carousel-caption">
//           </Carousel.Caption>
//         </Carousel.Item>
//         <Carousel.Item>
//           <img
//             className="d-block w-100"
//             src={Img2}
//             alt="Second slide"
//           />
//           <Carousel.Caption className="carousel-caption">
//           </Carousel.Caption>
//         </Carousel.Item>
//         <Carousel.Item>
//           <img
//             className="d-block w-100"
//             src={Img3}
//             alt="Third slide"
//           />
//           <Carousel.Caption className="carousel-caption">
//           </Carousel.Caption>
//         </Carousel.Item>
//       </Carousel>
//     </div>
//   );
// }

import React from "react";
import "../styles/hero.css"; // Import the corresponding CSS file

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Explore the World</h1>
        <p>Find the best deals on flights, hotels, and car rentals.</p>
        <div className="form-container">
          <div className="button-group">
            <button className="trip-btn">One Way</button>
            <button className="trip-btn active">Round Trip</button>
            <button className="trip-btn">Multi City</button>
          </div>
          <div className="search-form-wrapper">
            <form className="search-form">
              <div className="row row-cols-1 row-cols-md-4">
                <div className="col">
                  <label htmlFor="departureCity" className="form-label">Departure City</label>
                  <input type="text" className="form-control" id="departureCity" placeholder="DVO Davao" />
                  <small className="text-muted">Davao International Airport</small>
                </div>
                <div className="col">
                  <label htmlFor="arrivalCity" className="form-label">Arrival City</label>
                  <input type="text" className="form-control" id="arrivalCity" placeholder="MNL Manila" />
                  <small className="text-muted">Ninoy Aquino International Airport</small>
                </div>
                <div className="col">
                  <label htmlFor="departureDate" className="form-label">Departure Date</label>
                  <input type="date" className="form-control" id="departureDate" />
                </div>
                <div className="col">
                  <label htmlFor="returnDate" className="form-label">Return Date</label>
                  <input type="date" className="form-control" id="returnDate" />
                </div>
              </div>
              <div className="btn-container d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary btn-search">
                  Search Flights <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



