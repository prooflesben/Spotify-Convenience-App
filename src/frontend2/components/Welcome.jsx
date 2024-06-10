import { Button } from "react-bootstrap";
import "../App.css";

function Welcome() {
  const name = "Welcome Message";
  return (
    <div className="App">
      <h1>{name}</h1>
      <p1>
        This is a react app that creates a playlist based on your liked songs.
      </p1>
      <Button
        variant="primary"
        href= "http://localhost:5173/login"
      >
        Click to start the application
      </Button>
    </div>
  );
}

export default Welcome;
