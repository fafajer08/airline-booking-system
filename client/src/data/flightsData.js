const flightsData = [
  // September 1
  { 
    flightNo: 'AA101', 
    departureTime: new Date('2024-09-01T08:00:00Z'), 
    arrivalTime: new Date('2024-09-01T12:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 180, 
    bookedSeats: 120,
    departureCity: 'Davao', 
    departureAirport: 'Francisco Bangoy International Airport', 
    departurePortCode: 'DVO',
    arrivalCity: 'Manila', 
    arrivalAirport: 'NAIA International Airport', 
    arrivalPortCode: 'MNL'
  },
  { 
    flightNo: 'BA101', 
    departureTime: new Date('2024-09-01T10:00:00Z'), 
    arrivalTime: new Date('2024-09-01T14:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 200, 
    bookedSeats: 150,
    departureCity: 'Cebu', 
    departureAirport: 'Mactan-Cebu International Airport', 
    departurePortCode: 'CEB',
    arrivalCity: 'Clark', 
    arrivalAirport: 'Clark International Airport', 
    arrivalPortCode: 'CRK'
  },

  // September 2
  { 
    flightNo: 'AA102', 
    departureTime: new Date('2024-09-02T09:00:00Z'), 
    arrivalTime: new Date('2024-09-02T13:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 150, 
    bookedSeats: 110,
    departureCity: 'Manila', 
    departureAirport: 'NAIA International Airport', 
    departurePortCode: 'MNL',
    arrivalCity: 'Davao', 
    arrivalAirport: 'Francisco Bangoy International Airport', 
    arrivalPortCode: 'DVO'
  },
  { 
    flightNo: 'BA102', 
    departureTime: new Date('2024-09-02T11:00:00Z'), 
    arrivalTime: new Date('2024-09-02T15:00:00Z'), 
    flightStatus: 'cancelled', 
    seats: 210, 
    bookedSeats: 0,
    departureCity: 'Clark', 
    departureAirport: 'Clark International Airport', 
    departurePortCode: 'CRK',
    arrivalCity: 'Cebu', 
    arrivalAirport: 'Mactan-Cebu International Airport', 
    arrivalPortCode: 'CEB'
  },
  { 
    flightNo: 'CA102', 
    departureTime: new Date('2024-09-02T14:00:00Z'), 
    arrivalTime: new Date('2024-09-02T18:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 180, 
    bookedSeats: 130,
    departureCity: 'Davao', 
    departureAirport: 'Francisco Bangoy International Airport', 
    departurePortCode: 'DVO',
    arrivalCity: 'Manila', 
    arrivalAirport: 'NAIA International Airport', 
    arrivalPortCode: 'MNL'
  },

  // September 3
  { 
    flightNo: 'AA103', 
    departureTime: new Date('2024-09-03T08:00:00Z'), 
    arrivalTime: new Date('2024-09-03T12:00:00Z'), 
    flightStatus: 'cancelled', 
    seats: 190, 
    bookedSeats: 0,
    departureCity: 'Cebu', 
    departureAirport: 'Mactan-Cebu International Airport', 
    departurePortCode: 'CEB',
    arrivalCity: 'Clark', 
    arrivalAirport: 'Clark International Airport', 
    arrivalPortCode: 'CRK'
  },
  { 
    flightNo: 'BA103', 
    departureTime: new Date('2024-09-03T10:00:00Z'), 
    arrivalTime: new Date('2024-09-03T14:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 200, 
    bookedSeats: 160,
    departureCity: 'Manila', 
    departureAirport: 'NAIA International Airport', 
    departurePortCode: 'MNL',
    arrivalCity: 'Davao', 
    arrivalAirport: 'Francisco Bangoy International Airport', 
    arrivalPortCode: 'DVO'
  },

  // September 4
  { 
    flightNo: 'CA103', 
    departureTime: new Date('2024-09-04T09:00:00Z'), 
    arrivalTime: new Date('2024-09-04T13:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 150, 
    bookedSeats: 120,
    departureCity: 'Clark', 
    departureAirport: 'Clark International Airport', 
    departurePortCode: 'CRK',
    arrivalCity: 'Cebu', 
    arrivalAirport: 'Mactan-Cebu International Airport', 
    arrivalPortCode: 'CEB'
  },
  { 
    flightNo: 'DA103', 
    departureTime: new Date('2024-09-04T11:00:00Z'), 
    arrivalTime: new Date('2024-09-04T15:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 180, 
    bookedSeats: 140,
    departureCity: 'Davao', 
    departureAirport: 'Francisco Bangoy International Airport', 
    departurePortCode: 'DVO',
    arrivalCity: 'Manila', 
    arrivalAirport: 'NAIA International Airport', 
    arrivalPortCode: 'MNL'
  },
  { 
    flightNo: 'EA103', 
    departureTime: new Date('2024-09-04T14:00:00Z'), 
    arrivalTime: new Date('2024-09-04T18:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 220, 
    bookedSeats: 180,
    departureCity: 'Cebu', 
    departureAirport: 'Mactan-Cebu International Airport', 
    departurePortCode: 'CEB',
    arrivalCity: 'Clark', 
    arrivalAirport: 'Clark International Airport', 
    arrivalPortCode: 'CRK'
  },

  // Add more entries for the rest of the days with the specified data structure...

  // September 30
  { 
    flightNo: 'OA602', 
    departureTime: new Date('2024-09-30T15:00:00Z'), 
    arrivalTime: new Date('2024-09-30T19:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 240, 
    bookedSeats: 220,
    departureCity: 'Manila', 
    departureAirport: 'NAIA International Airport', 
    departurePortCode: 'MNL',
    arrivalCity: 'Davao', 
    arrivalAirport: 'Francisco Bangoy International Airport', 
    arrivalPortCode: 'DVO'
  },
  { 
    flightNo: 'PA702', 
    departureTime: new Date('2024-09-30T16:00:00Z'), 
    arrivalTime: new Date('2024-09-30T20:00:00Z'), 
    flightStatus: 'ontime', 
    seats: 200, 
    bookedSeats: 180,
    departureCity: 'Clark', 
    departureAirport: 'Clark International Airport', 
    departurePortCode: 'CRK',
    arrivalCity: 'Cebu', 
    arrivalAirport: 'Mactan-Cebu International Airport', 
    arrivalPortCode: 'CEB'
  },
  { 
    flightNo: 'QA802', 
    departureTime: new Date('2024-09-30T17:00:00Z'), 
    arrivalTime: new Date('2024-09-30T21:00:00Z'), 
    flightStatus: 'cancelled', 
    seats: 210, 
    bookedSeats: 0,
    departureCity: 'Davao', 
    departureAirport: 'Francisco Bangoy International Airport', 
    departurePortCode: 'DVO',
    arrivalCity: 'Manila', 
    arrivalAirport: 'NAIA International Airport', 
    arrivalPortCode: 'MNL'
  }
];

module.exports = flightsData;
