import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoryAssessment from './EldComponent/StoryAssessment';
import EldResults from './EldComponent/EldResults'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/story" element={<StoryAssessment />} />
        <Route path="/eldResults" element={<EldResults />} />
      </Routes>
    </Router>
  );
}

export default App;
