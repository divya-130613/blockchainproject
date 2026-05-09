import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Verify from "./Verify";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify/:id" element={<Verify />} />
      </Routes>
    </Router>
  );
}

export default App;