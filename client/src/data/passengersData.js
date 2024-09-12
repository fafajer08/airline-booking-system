const passengersData = [
  {
      "id": 1,
      "firstName": "Emily",
      "lastName": "Williams",
      "nationality": "American",
      "passportNo": "K12345678",
      "birthday": "1993-05-14",
      "email": "emily.williams@example.com",
      "phoneNo": "+1-555-234-5678"
  },
  {
      "id": 2,
      "firstName": "Michael",
      "lastName": "Taylor",
      "nationality": "Canadian",
      "passportNo": "L23456789",
      "birthday": "1987-11-22",
      "email": "michael.taylor@example.com",
      "phoneNo": "+1-514-234-5678"
  },
  {
      "id": 3,
      "firstName": "Hannah",
      "lastName": "Brown",
      "nationality": "British",
      "passportNo": "M34567890",
      "birthday": "1995-09-01",
      "email": "hannah.brown@example.com",
      "phoneNo": "+44-161-234-5678"
  },
  {
      "id": 4,
      "firstName": "Lucas",
      "lastName": "Wilson",
      "nationality": "Australian",
      "passportNo": "N45678901",
      "birthday": "1990-06-30",
      "email": "lucas.wilson@example.com",
      "phoneNo": "+61-3-1234-5678"
  },
  {
      "id": 5,
      "firstName": "Chloe",
      "lastName": "Davis",
      "nationality": "New Zealander",
      "passportNo": "O56789012",
      "birthday": "1984-02-17",
      "email": "chloe.davis@example.com",
      "phoneNo": "+64-9-123-4567"
  },
  {
      "id": 6,
      "firstName": "Liam",
      "lastName": "Johnson",
      "nationality": "Irish",
      "passportNo": "P67890123",
      "birthday": "1992-10-03",
      "email": "liam.johnson@example.com",
      "phoneNo": "+353-1-234-5678"
  },
  {
      "id": 7,
      "firstName": "Emma",
      "lastName": "Martinez",
      "nationality": "Spanish",
      "passportNo": "Q78901234",
      "birthday": "1989-04-21",
      "email": "emma.martinez@example.com",
      "phoneNo": "+34-91-234-5678"
  },
  {
      "id": 8,
      "firstName": "Oliver",
      "lastName": "Garcia",
      "nationality": "Mexican",
      "passportNo": "R89012345",
      "birthday": "1996-12-10",
      "email": "oliver.garcia@example.com",
      "phoneNo": "+52-33-234-5678"
  },
  {
      "id": 9,
      "firstName": "Sophia",
      "lastName": "Rodriguez",
      "nationality": "Argentinian",
      "passportNo": "S90123456",
      "birthday": "1987-01-15",
      "email": "sophia.rodriguez@example.com",
      "phoneNo": "+54-11-234-5678"
  },
  {
      "id": 10,
      "firstName": "James",
      "lastName": "Kim",
      "nationality": "South Korean",
      "passportNo": "T01234567",
      "birthday": "1994-07-25",
      "email": "james.kim@example.com",
      "phoneNo": "+82-2-234-5678"
  },
  {
      "id": 11,
      "firstName": "Isabella",
      "lastName": "Nguyen",
      "nationality": "Vietnamese",
      "passportNo": "U12345678",
      "birthday": "1993-08-09",
      "email": "isabella.nguyen@example.com",
      "phoneNo": "+84-28-1234-5678"
  },
  {
      "id": 12,
      "firstName": "Alexander",
      "lastName": "Harris",
      "nationality": "American",
      "passportNo": "V23456789",
      "birthday": "1985-12-02",
      "email": "alexander.harris@example.com",
      "phoneNo": "+1-212-345-6789"
  },
  {
      "id": 13,
      "firstName": "Mia",
      "lastName": "Gonzalez",
      "nationality": "Colombian",
      "passportNo": "W34567890",
      "birthday": "1990-03-29",
      "email": "mia.gonzalez@example.com",
      "phoneNo": "+57-1-234-5678"
  },
  {
      "id": 14,
      "firstName": "Ethan",
      "lastName": "Roberts",
      "nationality": "Canadian",
      "passportNo": "X45678901",
      "birthday": "1992-11-15",
      "email": "ethan.roberts@example.com",
      "phoneNo": "+1-416-345-6789"
  },
  {
      "id": 15,
      "firstName": "Ava",
      "lastName": "Smith",
      "nationality": "Australian",
      "passportNo": "Y56789012",
      "birthday": "1988-09-08",
      "email": "ava.smith@example.com",
      "phoneNo": "+61-7-1234-5678"
  },
  {
      "id": 16,
      "firstName": "Noah",
      "lastName": "Lee",
      "nationality": "South Korean",
      "passportNo": "Z67890123",
      "birthday": "1995-04-04",
      "email": "noah.lee@example.com",
      "phoneNo": "+82-10-1234-5678"
  },
  {
      "id": 17,
      "firstName": "Mia",
      "lastName": "Taylor",
      "nationality": "New Zealander",
      "passportNo": "A78901234",
      "birthday": "1991-10-12",
      "email": "mia.taylor@example.com",
      "phoneNo": "+64-3-123-4567"
  },
  {
      "id": 18,
      "firstName": "Lucas",
      "lastName": "Jackson",
      "nationality": "British",
      "passportNo": "B89012345",
      "birthday": "1986-06-16",
      "email": "lucas.jackson@example.com",
      "phoneNo": "+44-20-345-6789"
  },
  {
      "id": 19,
      "firstName": "Ella",
      "lastName": "White",
      "nationality": "American",
      "passportNo": "C90123456",
      "birthday": "1994-01-29",
      "email": "ella.white@example.com",
      "phoneNo": "+1-305-123-4567"
  },
  {
      "id": 20,
      "firstName": "Jack",
      "lastName": "Martin",
      "nationality": "Spanish",
      "passportNo": "D01234567",
      "birthday": "1989-07-19",
      "email": "jack.martin@example.com",
      "phoneNo": "+34-93-123-4567"
  },
  {
      "id": 21,
      "firstName": "Zoe",
      "lastName": "Miller",
      "nationality": "Canadian",
      "passportNo": "E12345678",
      "birthday": "1993-05-25",
      "email": "zoe.miller@example.com",
      "phoneNo": "+1-403-123-4567"
  },
  {
      "id": 22,
      "firstName": "Liam",
      "lastName": "Wilson",
      "nationality": "Australian",
      "passportNo": "F23456789",
      "birthday": "1992-12-30",
      "email": "liam.wilson@example.com",
      "phoneNo": "+61-8-1234-5678"
  },
  {
      "id": 23,
      "firstName": "Olivia",
      "lastName": "Taylor",
      "nationality": "British",
      "passportNo": "G34567890",
      "birthday": "1985-04-17",
      "email": "olivia.taylor@example.com",
      "phoneNo": "+44-131-234-5678"
  },
  {
      "id": 24,
      "firstName": "Matthew",
      "lastName": "Garcia",
      "nationality": "Mexican",
      "passportNo": "H45678901",
      "birthday": "1991-08-05",
      "email": "matthew.garcia@example.com",
      "phoneNo": "+52-55-234-5678"
  },
  {
      "id": 25,
      "firstName": "Sophia",
      "lastName": "Johnson",
      "nationality": "Argentinian",
      "passportNo": "I56789012",
      "birthday": "1996-09-21",
      "email": "sophia.johnson@example.com",
      "phoneNo": "+54-9-1234-5678"
  },
  {
      "id": 26,
      "firstName": "Noah",
      "lastName": "Roberts",
      "nationality": "American",
      "passportNo": "J67890123",
      "birthday": "1990-11-10",
      "email": "noah.roberts@example.com",
      "phoneNo": "+1-415-123-4567"
  },
  {
      "id": 27,
      "firstName": "Emma",
      "lastName": "Lee",
      "nationality": "Spanish",
      "passportNo": "K78901234",
      "birthday": "1988-06-07",
      "email": "emma.lee@example.com",
      "phoneNo": "+34-91-345-6789"
  },
  {
      "id": 28,
      "firstName": "Oliver",
      "lastName": "Taylor",
      "nationality": "Canadian",
      "passportNo": "L89012345",
      "birthday": "1994-03-23",
      "email": "oliver.taylor@example.com",
      "phoneNo": "+1-514-456-7890"
  },
  {
      "id": 29,
      "firstName": "Ava",
      "lastName": "Anderson",
      "nationality": "Australian",
      "passportNo": "M90123456",
      "birthday": "1995-10-12",
      "email": "ava.anderson@example.com",
      "phoneNo": "+61-2-3456-7890"
  },
  {
      "id": 30,
      "firstName": "James",
      "lastName": "Miller",
      "nationality": "South Korean",
      "passportNo": "N01234567",
      "birthday": "1986-01-17",
      "email": "james.miller@example.com",
      "phoneNo": "+82-2-234-5678"
  }
];


export default passengersData;