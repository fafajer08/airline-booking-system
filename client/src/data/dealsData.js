import airport from '../images/airport.jpg'; // Replace this with actual image paths if needed

const deals = [
    {
      id: 1,
      title: "Save 10% on In-flight Meals",
      description: "Book now and save 10% on all in-flight meals, including snacks and drinks.",
      image: airport,  // In-flight meal image
      mechanics: "Applicable for all flights. Use code INFLIGHT10 at checkout. Offer available only for pre-booked meals.",
      promoDates: {
        start: "2024-09-01",
        end: "2024-09-30"
      }
    },
    {
      id: 2,
      title: "Upgrade to Business Class",
      description: "Enjoy a luxurious experience by upgrading to business class at a discounted rate.",
      image: airport,  // Business class seats image
      mechanics: "Upgrade to business class for 15% off on selected routes. Limited to 10 seats per flight.",
      promoDates: {
        start: "2024-10-01",
        end: "2024-10-31"
      }
    },
    {
      id: 3,
      title: "Free Airport Lounge Access",
      description: "Book now and enjoy free access to premium airport lounges across select locations.",
      image: airport,  // Airport lounge image
      mechanics: "Free lounge access is provided for bookings made in business or first class. Available in participating airports only.",
      promoDates: {
        start: "2024-09-15",
        end: "2024-12-31"
      }
    },
    {
      id: 4,
      title: "Extra Baggage Allowance",
      description: "Get an additional 10kg of baggage allowance for free when you book today.",
      image: airport,  // Baggage allowance image
      mechanics: "Offer applies to all international flights. Additional baggage allowance must be requested at the time of booking.",
      promoDates: {
        start: "2024-08-01",
        end: "2024-12-31"
      }
    },
    {
      id: 5,
      title: "Discounted Car Rentals",
      description: "Save up to 20% on car rentals at your destination when you book through our partner.",
      image: airport,  // Car rental image
      mechanics: "Discount valid for bookings made with our car rental partners. Use promo code RENTAL20 during booking.",
      promoDates: {
        start: "2024-09-01",
        end: "2024-12-31"
      }
    },
    {
      id: 6,
      title: "Hotel Discounts",
      description: "Enjoy exclusive hotel discounts when you book your flight and stay together.",
      image: airport,  // Hotel room image
      mechanics: "Hotel discounts apply only to bundled bookings (flight + hotel). Discount amount varies by location and date.",
      promoDates: {
        start: "2024-10-01",
        end: "2024-11-30"
      }
    },
  ];
  
export default deals;
