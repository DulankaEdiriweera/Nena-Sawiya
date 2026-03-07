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
import StudentDirection from "./RldComponent/StudentDirectionGame";
import AdminJumbledForm from "./RldComponent/AdminJumbledForm";
import StudentJumbledGame from "./RldComponent/StudentJumbledGame";
import AdminCategorizeForm from "./RldComponent/Admincategorizeform";
import StudentCategorizeGame from "./RldComponent/Studentcategorizegame";
import AdminComprehensionForm from "./RldComponent/Admincomprehensionform";
import StudentComprehensionGame from "./RldComponent/Studentcomprehensiongame";
import AdminWHForm from "./RldComponent/AdminWhForm";
import StudentWHGame from "./RldComponent/StudentWhGame";
import RLDAdminDashboard from "./RldComponent/RLDAdminDashboard";
import StudentDashboard from "./RldComponent/StudentDashboard";

import VCDashboard from "./VCcomponent/VCDashboard";
import VCAssessment from "./VCcomponent/VCAssessment";
import VCResults from "./VCcomponent/VCResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/story"
          element={
            <ProtectedRoute role="user">
              <StoryAssessment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/eldResults"
          element={
            <ProtectedRoute role="user">
              <EldResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/elduserguide"
          element={
            <ProtectedRoute role="user">
              <ELDUserGuide />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/RLDTestInstructionsPage"
          element={
            <ProtectedRoute role="user">
              <RLDTestInstructionsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/vcDashboard" element={<VCDashboard />} />
        <Route path="/vcAssessment" element={<VCAssessment />} />
        <Route path="/vcResults" element={<VCResults />} />
      </Routes>
    </Router>
  );
}

export default App;
