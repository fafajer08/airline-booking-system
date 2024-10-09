// import { useState } from "react";
// import { Notyf } from "notyf";
// import 'notyf/notyf.min.css'; // Import Notyf's CSS
// import '../styles/checkin.css'; // Import the external CSS file

// // Create an instance of Notyf for notifications
// const notyf = new Notyf();

// export default function Checkin() {
//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [ticket, setTicket] = useState("");
//   const [checkinData, setCheckinData] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null); // New state for error messages

//   const decodeShortenedObjectId = (shortId) => {
//     const base64ToUint8Array = (base64) => {
//       const decoded = base64
//         .replace(/-/g, '+')
//         .replace(/_/g, '/');
//       const padded = decoded.padEnd(decoded.length + (4 - decoded.length % 4) % 4, '=');
//       return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
//     };

//     const bytesToHex = (bytes) => {
//       return Array.from(bytes)
//         .map(byte => byte.toString(16).padStart(2, '0'))
//         .join('');
//     };

//     const bytes = base64ToUint8Array(shortId);
//     return bytesToHex(bytes);
//   };

//   async function handleSubmit(e) {
//     e.preventDefault();
//     const originalId = decodeShortenedObjectId(ticket);

//     // Check if the originalId is a valid 24-character ObjectId
//     if (!originalId || originalId.length !== 24) {
//       setErrorMessage('Invalid ticket number. Please check and try again.');
//       setCheckinData(null); // Clear check-in data when there is an error
//       return;
//     }

//     // Clear any previous error message and check-in data before the new request
//     setErrorMessage(null);
//     setCheckinData(null);

//     const payload = {
//       firstName: firstname,
//       lastName: lastname,
//     };

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/${originalId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       console.log(data);
//       setCheckinData(data);
//       notyf.success(data.message); // Success notification
//     } catch (error) {
//       console.error('There was an error fetching the check-in data:', error);
//       setCheckinData(null); // Clear check-in data on fetch error
//       notyf.error('There was an error processing your check-in.'); // Error notification
//     }
//   }

//   return (
//     <div className="checkin-container container">
//       <h1>Check-in</h1>
//       <form className="checkin-form" onSubmit={handleSubmit}>
//         <label>
//           First Name:
//           <input 
//             type="text" 
//             name="firstname" 
//             placeholder="Enter your first name" 
//             value={firstname} 
//             onChange={(e) => setFirstname(e.target.value)} 
//           />
//         </label>
//         <label>
//           Last Name:
//           <input 
//             type="text" 
//             name="lastname" 
//             placeholder="Enter name on the ticket" 
//             value={lastname} 
//             onChange={(e) => setLastname(e.target.value)} 
//           />
//         </label>
//         <label>
//           Ticket Number:
//           <input 
//             type="text" 
//             name="ticket" 
//             placeholder="Case sensitive" 
//             value={ticket} 
//             onChange={(e) => setTicket(e.target.value)} 
//           />
//         </label>
//         <input type="submit" value="Submit" />
//       </form>

//       {/* Display error message or check-in message */}
//       {(errorMessage || checkinData?.message) && (
//         <div className="message-container">
//           <p>{errorMessage || checkinData.message}</p>
//         </div>
//       )}

//       {/* Check-in details */}
//       {checkinData?.booking && checkinData.booking.commercialFlightId && (
//         <div className="checkin-info">
//           <h2>Check-in Information</h2>
//           <p><strong>Flight:</strong> {checkinData.booking.commercialFlightId.flight?.flightNo}</p>
//           <p><strong>Route:</strong> {checkinData.booking.commercialFlightId.flight?.route?.departureAirportCode} - {checkinData.booking.commercialFlightId.flight?.route?.destinationAirportCode}</p>
//           <p><strong>Departure:</strong> {checkinData.booking.commercialFlightId.date} / {checkinData.booking.commercialFlightId.departureTime} H</p>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { Notyf } from "notyf";
import 'notyf/notyf.min.css'; // Import Notyf's CSS
import '../styles/checkin.css'; // Import the external CSS file

// Create an instance of Notyf for notifications
const notyf = new Notyf();

export default function Checkin() {
  const { id, firstName, lastName } = useParams(); // Extract parameters
  const [firstname, setFirstname] = useState(firstName || "");
  const [lastname, setLastname] = useState(lastName || "");
  const [ticket, setTicket] = useState(id || "");
  const [checkinData, setCheckinData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const decodeShortenedObjectId = (shortId) => {
    const base64ToUint8Array = (base64) => {
      const decoded = base64.replace(/-/g, '+').replace(/_/g, '/');
      const padded = decoded.padEnd(decoded.length + (4 - (decoded.length % 4)) % 4, '=');
      return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
    };

    const bytesToHex = (bytes) => {
      return Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    };

    const bytes = base64ToUint8Array(shortId);
    return bytesToHex(bytes);
  };

  useEffect(() => {
    // Optionally, you can trigger the submit automatically if all params are present
    if (firstname && lastname && ticket) {
      handleSubmit(new Event('submit'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const originalId = decodeShortenedObjectId(ticket);

    // Check if the originalId is a valid 24-character ObjectId
    if (!originalId || originalId.length !== 24) {
      setErrorMessage('Invalid ticket number. Please check and try again.');
      setCheckinData(null);
      return;
    }

    // Clear any previous error message and check-in data before the new request
    setErrorMessage(null);
    setCheckinData(null);

    const payload = {
      firstName: firstname,
      lastName: lastname,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/${originalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setCheckinData(data);
      notyf.success(data.message);
    } catch (error) {
      console.error('There was an error fetching the check-in data:', error);
      setCheckinData(null);
      notyf.error('There was an error processing your check-in.');
    }
  }

  return (
    <div className="checkin-container container">
      <h1>Check-in</h1>
      <form className="checkin-form" onSubmit={handleSubmit}>
        <label>
          First Name:
          <input 
            type="text" 
            name="firstname" 
            placeholder="Enter your first name" 
            value={firstname} 
            onChange={(e) => setFirstname(e.target.value)} 
          />
        </label>
        <label>
          Last Name:
          <input 
            type="text" 
            name="lastname" 
            placeholder="Enter name on the ticket" 
            value={lastname} 
            onChange={(e) => setLastname(e.target.value)} 
          />
        </label>
        <label>
          Ticket Number:
          <input 
            type="text" 
            name="ticket" 
            placeholder="Case sensitive" 
            value={ticket} 
            onChange={(e) => setTicket(e.target.value)} 
          />
        </label>
        <input type="submit" value="Submit" />
      </form>

      {/* Display error message or check-in message */}
      {(errorMessage || checkinData?.message) && (
        <div className="message-container">
          <p>{errorMessage || checkinData.message}</p>
        </div>
      )}

      {/* Check-in details */}
      {checkinData?.booking && checkinData.booking.commercialFlightId && (
        <div className="checkin-info">
          <h2>Check-in Information</h2>
          <p><strong>Flight:</strong> {checkinData.booking.commercialFlightId.flight?.flightNo}</p>
          <p><strong>Route:</strong> {checkinData.booking.commercialFlightId.flight?.route?.departureAirportCode} - {checkinData.booking.commercialFlightId.flight?.route?.destinationAirportCode}</p>
          <p><strong>Departure:</strong> {checkinData.booking.commercialFlightId.date} / {checkinData.booking.commercialFlightId.departureTime} H</p>
        </div>
      )}
    </div>
  );
}

