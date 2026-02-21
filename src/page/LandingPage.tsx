import { useState } from "react";
import "./css/landing.css";

type Workspace = {
  id: string;
  name: string;
  createdAt: Date;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const LandingPage = () => {
  const [workspaceName, setWorkspaceName] = useState("");

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: crypto.randomUUID(), name: "Frontend Developer", createdAt: new Date("2026-02-14") },
    { id: crypto.randomUUID(), name: "Product Manager", createdAt: new Date("2026-01-19") },
  ]);

  const handleStartDemo = () => {
    console.log("Start demo clicked");
  };

  const handleCreateWorkspace = () => {
    const name = workspaceName.trim();
    if (!name) return;

    const newWorkspace: Workspace = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
    };

    setWorkspaces((prev) => [newWorkspace, ...prev]);
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

          <div className="workspace-grid">
            {workspaces.map((ws) => (
              <button key={ws.id} className="workspace-tile" type="button">
                <div className="workspace-tile__icon" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                  </svg>
                </div>

                <div className="workspace-tile__title">{ws.name}</div>
                <div className="workspace-tile__meta">{formatDate(ws.createdAt)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
