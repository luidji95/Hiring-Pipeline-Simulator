import { useState } from "react";
import "./css/landing.css";

export const LandingPage = () => {
  const [workspaceName, setWorkspaceName] = useState("");

  const handleStartDemo = () => {
    console.log("Start demo clicked");
  };

  const handleCreateWorkspace = () => {
    if (!workspaceName.trim()) return;
    console.log("Create workspace:", workspaceName);
    setWorkspaceName("");
  };

  return (
    <div className="landing">
      <div className="landing__overlay" />

      <div className="landing__content">
        <h1 className="landing__title">Hiring Pipeline Simulator</h1>

        <p className="landing__subtitle">
          Simulate real hiring workflows. Move candidates, track decisions, and analyze your recruitment pipeline.
        </p>

        <div className="landing__actions">
          <button className="btn btn--primary" onClick={handleStartDemo}>
            Start Demo
          </button>

          <div className="workspace-create">
            <input
              type="text"
              placeholder="Create new pipeline (e.g. Frontend Developer)"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <button className="btn btn--secondary" onClick={handleCreateWorkspace}>
              Create
            </button>
          </div>
        </div>

        <div className="landing__workspaces">
          <h3>Your Pipelines</h3>
          <div className="workspace-list">
            <div className="workspace-card">Frontend Developer</div>
            <div className="workspace-card">Product Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
};
