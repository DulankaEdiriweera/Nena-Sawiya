import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoryAssessment from "./EldComponent/StoryAssessment";
import EldResults from "./EldComponent/EldResults";
import ELDUserGuide from "./EldComponent/EldUserGuide";
import VisualDiscriminationHome from "./pages/visualDiscriminationPages/VisualDisciminationHome";
import StudentAdvicePageDis from "./pages/visualDiscriminationPages/DiscriminationAdvices";
import Level1Discrimination from "./pages/visualDiscriminationPages/DiscriminationLevel1AllInOne";
import ObjectCountingPageDiscrimination from "./pages/visualDiscriminationPages/DiscriminationLevel2";
import Level3ShapeMemory from "./pages/visualDiscriminationPages/DiscriminationL3P1";
import Level3Choices from "./pages/visualDiscriminationPages/DiscriminationL3P2";
import FinalSummary from "./pages/visualDiscriminationPages/DiscrminationSummary";
import Home from "./Components/Home";

import RLDTestInstructionsPage from "./RldComponent/RLDTestInstructionsPage";
import AdminDirection from "./RldComponent/AdminDirection";
//import StudentDirection from "./RldComponent/StudentDirection";

import VCDashboard from "./VCcomponent/VCDashboard";
import VCAssessment from "./VCcomponent/VCAssessment";
import VCResults from "./VCcomponent/VCResults";
import PictureMCQTask from "./EldComponent/PictureMCQTask";
import AddPictureMCQ from "./EldComponent/AddPictureMCQ";
import StoryClozeTask from "./EldComponent/StoryClozeTask";
import AddStoryCloze from "./EldComponent/AddStoryCloze";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<StoryAssessment />} />
        <Route path="/eldResults" element={<EldResults />} />
        <Route path="/elduserguide" element={<ELDUserGuide />} />
        <Route path="/visual" element={<VisualDiscriminationHome />} />
        <Route path="/visualDisAdvices" element={<StudentAdvicePageDis />} />
        <Route path="/level1allin1" element={<Level1Discrimination />} />
        <Route
          path="/discriminationL2"
          element={<ObjectCountingPageDiscrimination />}
        />
        <Route path="/discriminationL3P1" element={<Level3ShapeMemory />} />
        <Route path="/discriminationL3p2" element={<Level3Choices />} />
        <Route path="/summary" element={<FinalSummary />} />
        <Route
          path="/RLDTestInstructionsPage"
          element={<RLDTestInstructionsPage />}
        />

        {/*<Route path="/student-direction" element={<StudentDirection />} />*/}
        <Route path="/admin-direction" element={<AdminDirection />} />

        <Route path="/vcDashboard" element={<VCDashboard />} />
        <Route path="/vcAssessment" element={<VCAssessment />} />
        <Route path="/vcResults" element={<VCResults />} />

        <Route path="/pictureMCQTask" element={<PictureMCQTask />} />
        <Route path="/addPictureMCQ" element={<AddPictureMCQ />} />
        <Route path="/storyClozeTask" element={<StoryClozeTask />} />
        <Route path="/addStoryCloze" element={<AddStoryCloze />} />
      </Routes>
    </Router>
  );
}

export default App;
