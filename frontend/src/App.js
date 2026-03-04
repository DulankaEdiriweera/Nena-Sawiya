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
import StudentELDDashboard from "./EldComponent/StudentELDDashboard";
import InterventionDashboard from "./Components/Intervention Dashboard";
import Progress from "./Components/Progress";

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
import VDAdminDashboard from "./pages/visualDiscriminationPages/VisualDAdminDashBoard";


import AdminAddVCJigsaw from "./VCcomponent/AdminAddVCJigsaw";
import VCJigsawList from "./VCcomponent/VCJigsawList";
import VCJigsawPage from "./VCcomponent/VCJigsawPage";
import AdminVCJigsawList from "./VCcomponent/AdminVCJigsawList";
import VCPicComList from "./VCcomponent/VCPicComList";
import VCPicComPage  from "./VCcomponent/VCPicComPage";
import AdminAddVCPicCom from "./VCcomponent/AdminAddVCPicCom";
import AdminVCPicComList from "./VCcomponent/AdminVCPicComList";
import VCShaMatList from "./VCcomponent/VCShaMatList";
import VCShaMatPage from "./VCcomponent/VCShaMatPage";
import AdminAddVCShaMat from "./VCcomponent/AdminAddVCShaMat";
import AdminVCShaMatList from "./VCcomponent/AdminVCShaMatList";
import VCStudentDashboard from "./VCcomponent/VCStudentDashboard";
import VCAdminDashboard from "./VCcomponent/VCAdminDashboard";

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
        <Route
          path="/student-direction"
          element={
            <ProtectedRoute role="user">
              <StudentDirection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-direction"
          element={
            <ProtectedRoute role="admin">
              <AdminDirection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-jumbled"
          element={
            <ProtectedRoute role="admin">
              <AdminJumbledForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-jumbled"
          element={
            <ProtectedRoute role="user">
              <StudentJumbledGame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-categorize"
          element={
            <ProtectedRoute role="admin">
              <AdminCategorizeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-categorize"
          element={
            <ProtectedRoute role="user">
              <StudentCategorizeGame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-comprehension"
          element={
            <ProtectedRoute role="admin">
              <AdminComprehensionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-comprehension"
          element={
            <ProtectedRoute role="user">
              <StudentComprehensionGame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-wh"
          element={
            <ProtectedRoute role="admin">
              <AdminWHForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-wh"
          element={
            <ProtectedRoute role="user">
              <StudentWHGame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rld-admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <RLDAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rld-student-dashboard"
          element={
            <ProtectedRoute role="user">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcDashboard"
          element={
            <ProtectedRoute role="user">
              <VCDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcAssessment"
          element={
            <ProtectedRoute role="user">
              <VCAssessment />
            </ProtectedRoute>
          }
        />

                <Route
          path="/vcResults"
          element={
            <ProtectedRoute role="user">
              <VCResults />
            </ProtectedRoute>
          }
        />

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
        <Route
          path="/eldStudentIntervention"
          element={
            <ProtectedRoute role="user">
              <StudentELDDashboard />
            </ProtectedRoute>
          }
        />

        {/*VisualD All Routes*/}


{/*VD Intervention*/}

        <Route
  path="/userVD1Drag"
  element={
    <ProtectedRoute role="user">
      <UserVdDragTextImage />
    </ProtectedRoute>
  }
/>

<Route
  path="/userVD1"
  element={
    <ProtectedRoute role="user">
      <UserVdPictureMCQ />
    </ProtectedRoute>
  }
/>

<Route
  path="/UserMemoryGamePage"
  element={
    <ProtectedRoute role="user">
      <MemoryGamePage />
    </ProtectedRoute>
  }
/>

<Route
  path="/CountImageGameVD"
  element={
    <ProtectedRoute role="user">
      <CountImageGame />
    </ProtectedRoute>
  }
/>

<Route
  path="/userVD1Drag"
  element={
    <ProtectedRoute role="user">
      <UserVdDragTextImage />
    </ProtectedRoute>
  }
/>

<Route
  path="/userVD1"
  element={
    <ProtectedRoute role="user">
      <UserVdPictureMCQ />
    </ProtectedRoute>
  }
/>

<Route
  path="/UserMemoryGamePage"
  element={
    <ProtectedRoute role="user">
      <MemoryGamePage />
    </ProtectedRoute>
  }
/>

<Route
  path="/CountImageGameVD"
  element={
    <ProtectedRoute role="user">
      <CountImageGame />
    </ProtectedRoute>
  }
/>

<Route
  path="/AdminVdDragTextImage"
  element={
    <ProtectedRoute role="admin">
      <AdminVdDragTextImage />
    </ProtectedRoute>
  }
/>

<Route
  path="/AdminVdDragmanage"
  element={
    <ProtectedRoute role="admin">
      <AdminVdDragManage />
    </ProtectedRoute>
  }
/>

<Route
  path="/adminVD1"
  element={
    <ProtectedRoute role="admin">
      <AdminPictureMCQ />
    </ProtectedRoute>
  }
/>

<Route
  path="/AdminManageVdPictureMCQ1"
  element={
    <ProtectedRoute role="admin">
      <AdminManageVdPictureMCQ />
    </ProtectedRoute>
  }
/>

<Route
  path="/AdminAddMemoryGame1"
  element={
    <ProtectedRoute role="admin">
      <AdminAddMemoryGame />
    </ProtectedRoute>
  }
/>

<Route
  path="/AdminViewMemoryGames1"
  element={
    <ProtectedRoute role="admin">
      <AdminViewMemoryGames />
    </ProtectedRoute>
  }
/>

<Route
  path="/AdminAddCountImageGame1"
  element={
    <ProtectedRoute role="admin">
      <AdminAddCountImageGame />
    </ProtectedRoute>
  }
/>

<Route
  path="/AdminManageCountImageGames1"
  element={
    <ProtectedRoute role="admin">
      <AdminManageCountImageGames />
    </ProtectedRoute>
  }
/>

<Route
  path="/visual"
  element={
    <ProtectedRoute role="user">
      <VisualDiscriminationHome />
    </ProtectedRoute>
  }
/>

<Route
  path="/visualDisAdvices"
  element={
    <ProtectedRoute role="user">
      <StudentAdvicePageDis />
    </ProtectedRoute>
  }
/>

<Route
  path="/level1allin1"
  element={
    <ProtectedRoute role="user">
      <Level1Discrimination />
    </ProtectedRoute>
  }
/>

<Route
  path="/discriminationL2"
  element={
    <ProtectedRoute role="user">
      <ObjectCountingPageDiscrimination />
    </ProtectedRoute>
  }
/>

<Route
  path="/discriminationL3P1"
  element={
    <ProtectedRoute role="user">
      <Level3ShapeMemory />
    </ProtectedRoute>
  }
/>

<Route
  path="/discriminationL3p2"
  element={
    <ProtectedRoute role="user">
      <Level3Choices />
    </ProtectedRoute>
  }
/>

<Route
  path="/summary"
  element={
    <ProtectedRoute role="user">
      <FinalSummary />
    </ProtectedRoute>
  }
/>

<Route
  path="/VDAdminDashboard"
  element={
    <ProtectedRoute role="admin">
      <VDAdminDashboard />
    </ProtectedRoute>
  }
/>

   {/*VC Intervention Routes)*/}
        
                <Route
          path="/vcStudentDashboard"
          element={
            <ProtectedRoute role="user">
              <VCStudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcAdminDashboard"
          element={
            <ProtectedRoute role="admin">
              <VCAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcAdminAddJigsaw"
          element={
            <ProtectedRoute role="admin">
              <AdminAddVCJigsaw />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcJigsawList"
          element={
            <ProtectedRoute role="user">
              <VCJigsawList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcJigsaw/:puzzleId"
          element={
            <ProtectedRoute roles={["admin", "user"]}>
              <VCJigsawPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcAdminJigsawList"
          element={
            <ProtectedRoute role="admin">
              <AdminVCJigsawList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcPicCom"
          element={
            <ProtectedRoute role="user">
              <VCPicComList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcPicCom/:activityId"
          element={
            <ProtectedRoute roles={["admin", "user"]}>
              <VCPicComPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vcPicCom/add"
          element={
            <ProtectedRoute role="admin">
              <AdminAddVCPicCom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vcPicCom/list"
          element={
            <ProtectedRoute role="admin">
              <AdminVCPicComList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcShadowMatch"
          element={
            <ProtectedRoute role="user">
              <VCShaMatList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vcShadowMatch/:activityId"
          element={
            <ProtectedRoute roles={["admin", "user"]}>
              <VCShaMatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/addShadowMatch"
          element={
            <ProtectedRoute role="admin">
              <AdminAddVCShaMat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/shadowMatchList"
          element={
            <ProtectedRoute role="admin">
              <AdminVCShaMatList />
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
        <Route
          path="/intervention-dashboard"
          element={
            <ProtectedRoute role="user">
              <InterventionDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute role="user">
              < Progress/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
