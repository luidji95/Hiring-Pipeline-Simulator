import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./page/LandingPage/LandingPage";
import { WorkspacePage } from "./page/WorkspacePage/WorkspacePage";
import { CandidateDetails } from "./page/CandidatePage/CandidatePage";



export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace/:id" element={<WorkspacePage/>} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/workspace/:workspaceId/candidate/:candidateId" element={<CandidateDetails />} />
    </Routes>
  );
};
