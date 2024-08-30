import Form from 'react-bootstrap/Form';

function FlightSelector() {
  return (
    <Form.Select aria-label="Default select example">
      <option>Open this select menu</option>
      <option value="oneway">One Way</option>
      <option value="roundTrip">Round Trip</option>
      <option value="multiCity">Multi-City</option>
    </Form.Select>
  );
}

export default FlightSelector;