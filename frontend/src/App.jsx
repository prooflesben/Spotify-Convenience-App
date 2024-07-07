import Welcome from "./components/Welcome";
import Select from "./components/Select";
import PlaylistView from "./components/PlaylistView";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container" background-color="#282c34">
      <BrowserRouter>
        <Routes>
          <Route path="/select" element={<Select />} />
          <Route exact path="/" element={<Welcome />} />
          <Route exact path="/playlistView/:timeframe" element={<PlaylistView />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
