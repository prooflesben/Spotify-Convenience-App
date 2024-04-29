import Welcome from "./Welcome";
import Select from "./Select";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div class="container" background-colo="#282c34">
      <BrowserRouter>
        <Routes>
          <Route path="/select" element={<Select />} />
          <Route exact path="/" element={<Welcome />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
