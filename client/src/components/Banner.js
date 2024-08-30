import { Button, Row, Col } from "react-bootstrap";

export default function Banner() {
  return (
    <Row>
      <Col>
        <h1>Zuitt Coding Bootcamp</h1>
        <Button variant="primary">Enroll now!</Button>
      </Col>
    </Row>
  );
}
// export default function Banner() {
//   return (
//     <Row className="justify-content-center text-center">
//       <Col md={8}>
//         <h1>Zuitt Coding Bootcamp</h1>
//         <p>Opportunities for everyone, everywhere.</p>
//         <Button variant="primary">Enroll now!</Button>
//       </Col>
//     </Row>
//   );
// }
