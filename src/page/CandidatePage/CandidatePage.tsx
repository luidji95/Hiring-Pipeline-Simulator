
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getInstance } from "../../features/storage/hpsStorage";
import type { Candidate } from "../../features/workspace/workspace.types";

type Params = {
  workspaceId: string;
  candidateId: string;
};

export const CandidateDetails = () => {
  const { workspaceId, candidateId } = useParams() as Partial<Params>;
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || !candidateId) {
      navigate("/", { replace: true });
      return;
    }

    const instance = getInstance(workspaceId);
    if (!instance) {
      navigate("/", { replace: true });
      return;
    }

    const found = instance.candidatesById[candidateId];
    if (!found) {
      navigate(`/workspace/${workspaceId}`, { replace: true });
      return;
    }

    setWorkspaceName(instance.name);
    setCandidate(found);
    setLoading(false);
  }, [workspaceId, candidateId, navigate]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!candidate) return null;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <Link to={`/workspace/${workspaceId}`}>← Back to {workspaceName}</Link>
      </div>

      <div
        style={{
          border: "1px solid #333",
          padding: 20,
          borderRadius: 6,
          maxWidth: 720,
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          {candidate.firstName} {candidate.lastName}
        </h2>

        <div style={{ opacity: 0.8, marginBottom: 12 }}>
          {candidate.title}
          {candidate.company ? ` · ${candidate.company}` : ""}
          {candidate.location ? ` · ${candidate.location}` : ""}
        </div>

        <div style={{ marginTop: 12 }}>
          <p>
            <strong>Email:</strong> {candidate.email ?? "N/A"}
          </p>

          <p>
            <strong>LinkedIn:</strong>{" "}
            {candidate.linkedinUrl ? (
              <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer">
                Open
              </a>
            ) : (
              "N/A"
            )}
          </p>

          <p>
            <strong>GitHub:</strong>{" "}
            {candidate.githubUrl ? (
              <a href={candidate.githubUrl} target="_blank" rel="noreferrer">
                Open
              </a>
            ) : (
              "N/A"
            )}
          </p>

          <p>
            <strong>Portfolio:</strong>{" "}
            {candidate.portfolioUrl ? (
              <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer">
                Open
              </a>
            ) : (
              "N/A"
            )}
          </p>
        </div>

        <div style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Tags</h3>
          {candidate.tags?.length ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {candidate.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    border: "1px solid #333",
                    padding: "4px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                    opacity: 0.9,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ opacity: 0.7 }}>No tags</p>
          )}
        </div>
      </div>
    </div>
  );
};