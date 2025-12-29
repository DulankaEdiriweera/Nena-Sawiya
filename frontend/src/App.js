import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoryAssessment from './EldComponent/StoryAssessment';
import EldResults from './EldComponent/EldResults'
import VCDashboard from "./VCcomponent/VCDashboard";
import VCAssessment from './VCcomponent/VCAssessment';
import VCResults from './VCcomponent/VCResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/story" element={<StoryAssessment />} />
        <Route path="/eldResults" element={<EldResults />} />
               
        <Route path="/vc-dashboard" element={<VCDashboard />} />
        <Route path="/vc-assessment" element={<VCAssessment />} />
        <Route path="/vc-results" element={<VCResults />} />

      </Routes>
    </Router>
  );
}

export default App;
