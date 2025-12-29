import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoryAssessment from './EldComponent/StoryAssessment';
import EldResults from './EldComponent/EldResults'



import VisualDiscriminationHome from './pages/visualDiscriminationPages/VisualDisciminationHome';
import StudentAdvicePageDis from './pages/visualDiscriminationPages/DiscriminationAdvices';
import Level1Discrimination from './pages/visualDiscriminationPages/DiscriminationLevel1AllInOne';
import ObjectCountingPageDiscrimination from './pages/visualDiscriminationPages/DiscriminationLevel2';
import Level3ShapeMemory from './pages/visualDiscriminationPages/DiscriminationL3P1';
import Level3Choices from './pages/visualDiscriminationPages/DiscriminationL3P2';
import FinalSummary from './pages/visualDiscriminationPages/DiscrminationSummary';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/story" element={<StoryAssessment />} />
        <Route path="/eldResults" element={<EldResults />} />



        <Route path="/visual" element={<VisualDiscriminationHome />} />
        <Route path="/visualDisAdvices" element={<StudentAdvicePageDis />} />
        <Route path="/level1allin1" element={<Level1Discrimination />} />
        <Route path="/discriminationL2" element={<ObjectCountingPageDiscrimination />} />
        <Route path="/discriminationL3P1" element={<Level3ShapeMemory />} />
        <Route path="/discriminationL3p2" element={<Level3Choices />} />
        <Route path="/summary" element={<FinalSummary />} />




      </Routes>
    </Router>
  );
}

export default App;
