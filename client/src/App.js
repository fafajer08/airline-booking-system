import "./App.css";
import Container from "react-bootstrap/Container";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";


function App() {
  return (
    <div className="App">
      <div>
        <AppNavbar />
        <Container>
          <Home />
        </Container>
      </div>
    </div>
  );
}

export default App;
