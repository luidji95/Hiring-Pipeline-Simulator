import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LandingPage/landing.css";

import { WORKSPACE_TEMPLATES } from "../../features/workspace/workspaceTemplates";
import type { WorkspaceIndexItem } from "../../features/workspace/workspace.types";

import { createCustomInstance,createInstanceFromTemplate,getInstancesIndex,clearAllHpsData,clearDemoInstances } from "../../features/storage/hpsStorage";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const LandingPage = () => {
  const navigate = useNavigate();

  const [workspaceName, setWorkspaceName] = useState("");
  const [myWorkspaces, setMyWorkspaces] = useState<WorkspaceIndexItem[]>([]);

  const isDev = import.meta.env.DEV;

  const refreshIndex = () => setMyWorkspaces(getInstancesIndex());

  useEffect(() => {
    refreshIndex();
  }, []);

  const handleCreateWorkspace = () => {
    const name = workspaceName.trim();
    if (!name) return;

    const id = createCustomInstance(name);
    setWorkspaceName("");
    refreshIndex();

    navigate(`/workspace/${id}`);
  };

  const handleOpenTemplate = (templateId: string) => {
    // DEMO instance: not added to index by default
    const id = createInstanceFromTemplate(templateId);
    navigate(`/workspace/${id}`);
  };

  const handleOpenWorkspace = (id: string) => {
    navigate(`/workspace/${id}`);
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
          <div className="workspace-create">
            <input
              type="text"
              placeholder="Create new pipeline (e.g. Frontend Hiring)"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateWorkspace();
              }}
            />
            <button className="btn btn--secondary" onClick={handleCreateWorkspace}>
              Create
            </button>
          </div>

          {isDev && (
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <button
                className="btn btn--secondary"
                onClick={() => {
                  clearDemoInstances();
                  refreshIndex();
                }}
              >
                Reset demo instances
              </button>

              <button
                className="btn btn--secondary"
                onClick={() => {
                  clearAllHpsData();
                  refreshIndex();
                }}
              >
                Reset ALL local data
              </button>
            </div>
          )}
        </div>

        <div className="landing__workspaces">
          <h3>Templates</h3>

          <div className="workspace-grid">
            {WORKSPACE_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                className="workspace-tile"
                type="button"
                onClick={() => handleOpenTemplate(tpl.id)}
              >
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

                <div className="workspace-tile__title">{tpl.name}</div>
                <div className="workspace-tile__meta">Seeded candidates: {tpl.seedCandidates.length}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="landing__workspaces">
          <h3>Your Workspaces</h3>

          {myWorkspaces.length === 0 ? (
            <p className="landing__subtitle" style={{ marginTop: 8 }}>
              No workspaces yet. Create one above.
            </p>
          ) : (
            <div className="workspace-grid">
              {myWorkspaces.map((ws) => (
                <button
                  key={ws.id}
                  className="workspace-tile"
                  type="button"
                  onClick={() => handleOpenWorkspace(ws.id)}
                >
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
          )}
        </div>
      </div>
    </div>
  );
};
