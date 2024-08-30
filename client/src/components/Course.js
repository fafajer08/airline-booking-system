import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function Course() {
  return (
    <Card>
      {/* <Card.Header>Featured</Card.Header> */}
      <Card.Body>
        <Card.Title>Full Stack Developer</Card.Title>
        <Card.Text>
          <h6>Description:</h6>
          <p>
            A full-stack developer is a versatile tech profile who possesses the
            skills and knowledge to handle all aspects of web development,
            creating scalable, robust, and user-friendly applications.
          </p>
          <h6>Price:</h6>
          <p>PHP 10,000</p>
        </Card.Text>
        <Button variant="primary">Enroll</Button>
      </Card.Body>
    </Card>
  );
}

// export default WithHeaderExample;
