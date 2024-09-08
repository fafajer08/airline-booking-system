import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import WindowDestination from '../components/WindowDestination';


export default function Destinations() {
  const navigate = useNavigate();

  // Function to handle card click and navigate to details page
  const handleCardClick = (destination) => {
    navigate(`/details/${destination}`);
  };

  return (
    <WindowDestination />
   
  );
}
