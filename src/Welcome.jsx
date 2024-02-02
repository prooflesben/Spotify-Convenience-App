import { Button } from "react-bootstrap";
import "./App.css";
import { useState } from "react";

function Welcome() {
  const name = "Welcome Message";
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <h1>{name}</h1>
      <p1>
        This is a react app that creates a playlist based on your liked songs.
      </p1>
      <p1>The button has been clicked {count} times</p1>
      <Button
        variant="primary"
        href= "http://localhost:5173/login"
        onClick={() => {
          console.log(count);
          setCount(count + 1);
        }}
      >
        Click to start the application
      </Button>
    </div>
  );
}

export default Welcome;
