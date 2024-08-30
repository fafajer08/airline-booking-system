import { Carousel } from 'react-bootstrap';
import Img from '../images/hero.png';
import Img2 from '../images/hero-2.png';
import Img3 from '../images/hero-3.png';
import '../styles/hero.css';

export default function HeroCarousel() {
  return (
    <div className="hero-carousel">
      <Carousel className="carousel-fade">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Img}
            alt="First slide"
          />
          <Carousel.Caption className="carousel-caption">
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Img2}
            alt="Second slide"
          />
          <Carousel.Caption className="carousel-caption">
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Img3}
            alt="Third slide"
          />
          <Carousel.Caption className="carousel-caption">
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
