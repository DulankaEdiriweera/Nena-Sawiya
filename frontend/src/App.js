import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoryAssessment from "./EldComponent/StoryAssessment";
import EldResults from "./EldComponent/EldResults";
import RLDTest from "./RldComponent/RLDTest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/story" element={<StoryAssessment />} />
        <Route path="/eldResults" element={<EldResults />} />
        <Route path="/RLDTest" element={<RLDTest />} />
      </Routes>
    </Router>
  );
}

export default App;
