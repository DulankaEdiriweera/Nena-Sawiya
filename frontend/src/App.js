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
import AddSequencingActivity from "./EldComponent/AddSequencingActivity";
import SequencingTask from "./EldComponent/SequencingTask";
import StoryManage from "./EldComponent/StoryManage";
import PictureMCQManage from "./EldComponent/PictureMCQManage";
import SequencingManage from "./EldComponent/SequencingManage";
import ELDInterventionAdminDashboard from "./EldComponent/ELDInterventionAdminDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Register from "./Components/Register";
import Login from "./Components/Login";

import UserVdDragTextImage from "./pages/visualDiscriminationPages/UserVdDragTextImage";
import AdminVdDragTextImage from "./pages/visualDiscriminationPages/AdminVdDragTextImage";
import AdminVdDragManage from "./pages/visualDiscriminationPages/Adminvddragmanage";
import AdminPictureMCQ from "./pages/visualDiscriminationPages/VisualDAdminQ1";
import UserVdPictureMCQ from "./pages/visualDiscriminationPages/VisualDIntUser1";
import AdminManageVdPictureMCQ from "./pages/visualDiscriminationPages/VisualDAdminQ1manage";
import MemoryGamePage from "./pages/visualDiscriminationPages/VDImageMemoryMCQActivity";
import AdminAddMemoryGame from "./pages/visualDiscriminationPages/AdminMemoryImageQuestions";
import AdminViewMemoryGames from "./pages/visualDiscriminationPages/AdminViewMemoryImageGames";
import AdminAddCountImageGame from "./pages/visualDiscriminationPages/AdminAddObjectCountVD";
import AdminManageCountImageGames from "./pages/visualDiscriminationPages/AdminManageObjectCVD";
import CountImageGame from "./pages/visualDiscriminationPages/UserObjectCountVD";

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

        {/*ELD Intervention Routes)*/}
        <Route
          path="/pictureMCQTask"
          element={
            <ProtectedRoute role="user">
              <PictureMCQTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addPictureMCQ"
          element={
            <ProtectedRoute role="admin">
              <AddPictureMCQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/storyClozeTask"
          element={
            <ProtectedRoute role="user">
              <StoryClozeTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addStoryCloze"
          element={
            <ProtectedRoute role="admin">
              <AddStoryCloze />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addSequencingTask"
          element={
            <ProtectedRoute role="admin">
              <AddSequencingActivity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sequencingTask"
          element={
            <ProtectedRoute role="user">
              <SequencingTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/storyClozeManage"
          element={
            <ProtectedRoute role="admin">
              <StoryManage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pictureMCQManage"
          element={
            <ProtectedRoute role="admin">
              <PictureMCQManage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sequencingManage"
          element={
            <ProtectedRoute role="admin">
              <SequencingManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eldAdminIntervention"
          element={
            <ProtectedRoute role="admin">
              <ELDInterventionAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/*cmmon*/}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/userVD1Drag" element={<UserVdDragTextImage />} />
        <Route path="/AdminVdDragTextImage" element={<AdminVdDragTextImage />} />
        <Route path="/AdminVdDragmanage" element={<AdminVdDragManage />} />
        <Route path="/adminVD1" element={<AdminPictureMCQ />} />
        <Route path="/userVD1" element={<UserVdPictureMCQ />} />
        <Route path="/AdminManageVdPictureMCQ1" element={<AdminManageVdPictureMCQ />} />
        <Route path="/UserMemoryGamePage" element={<MemoryGamePage />} />
        <Route path="/AdminAddMemoryGame1" element={<AdminAddMemoryGame />} />
        <Route path="/AdminViewMemoryGames1" element={<AdminViewMemoryGames />} />
        <Route path="/AdminAddCountImageGame1" element={<AdminAddCountImageGame />} />
        <Route path="/AdminManageCountImageGames1" element={<AdminManageCountImageGames />} />
        <Route path="/CountImageGameVD" element={<CountImageGame />} />



      </Routes>
    </Router>
  );
}

export default App;
