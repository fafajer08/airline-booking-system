
import Navbar from "../components/NavBar";
import Hero from "../components/Hero";
import Destinations from './Destinations';
import WindowDealsCards from '../components/WindowDealsCards';
import WindowDestination from "../components/WindowDestination";

export default function Home() {
  return (
    <>
      <Hero />
      <WindowDestination />
      <WindowDealsCards />
    </>
  );
}
