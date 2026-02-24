import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./page/LandingPage";
import { WorkspacePage } from "./page/WorkSpacePage";



export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace/:id" element={<WorkspacePage/>} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
