import { Row, Col, Card } from "react-bootstrap";

export default function Highlights() {
  return (
    <Row className="mt-3 mb-3">
      <Col xs={12} md={4}>
        <Card className="cardHighlight p-3">
          <Card.Body>
            <Card.Title>
              <h2>Learn from Home</h2>
            </Card.Title>
            <Card.Text>
              Pariatur adipisicing aute do amet dolore cupidatat. Eu labore
              aliqua eiusmod commodo occaecat mollit ullamco labore minim. Minim
              irure fugiat anim ea sint consequat fugiat laboris id. Lorem elit
              irure mollit officia incididunt ea ullamco laboris excepteur amet.
              Cillum pariatur consequat adipisicing aute ex.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={4}>
        <Card className="cardHighlight p-3">
          <Card.Body>
            <Card.Title>
              <h2>Study Now, pay Later</h2>
            </Card.Title>
            <Card.Text>
              Pariatur adipisicing aute do amet dolore cupidatat. Eu labore
              aliqua eiusmod commodo occaecat mollit ullamco labore minim. Minim
              irure fugiat anim ea sint consequat fugiat laboris id. Lorem elit
              irure mollit officia incididunt ea ullamco laboris excepteur amet.
              Cillum pariatur consequat adipisicing aute ex.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={4}>
        <Card className="cardHighlight p-3">
          <Card.Body>
            <Card.Title>
              <h2>Be Part of our Community</h2>
            </Card.Title>
            <Card.Text>
              Pariatur adipisicing aute do amet dolore cupidatat. Eu labore
              aliqua eiusmod commodo occaecat mollit ullamco labore minim. Minim
              irure fugiat anim ea sint consequat fugiat laboris id. Lorem elit
              irure mollit officia incididunt ea ullamco laboris excepteur amet.
              Cillum pariatur consequat adipisicing aute ex.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
