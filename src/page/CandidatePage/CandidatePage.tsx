import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  addCandidateNote,
  getCandidateTimeline,
  getInstance,
} from "../../features/storage/hpsStorage";
import type {
  Candidate,
  CandidateEvent,
  StageId,
} from "../../features/workspace/workspace.types";

type Params = {
  workspaceId: string;
  candidateId: string;
};

const formatIso = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const CandidateDetails = () => {
  const { workspaceId, candidateId } = useParams() as Partial<Params>;
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(true);

  const [events, setEvents] = useState<CandidateEvent[]>([]);
  const [noteText, setNoteText] = useState("");
  const [stageLabelById, setStageLabelById] = useState<Record<StageId, string> | null>(null);

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

    const stageMap = instance.stages.reduce((acc, s) => {
      acc[s.id] = s.label;
      return acc;
    }, {} as Record<StageId, string>);

    setStageLabelById(stageMap);
    setWorkspaceName(instance.name);
    setCandidate(found);

    setEvents(getCandidateTimeline(workspaceId, candidateId));
    setLoading(false);
  }, [workspaceId, candidateId, navigate]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!candidate) return null;

  const formatEventText = (e: CandidateEvent) => {
    if (e.type === "created") return "Candidate created";

    if (e.type === "stage_moved") {
      const from = stageLabelById?.[e.payload.fromStageId] ?? e.payload.fromStageId;
      const to = stageLabelById?.[e.payload.toStageId] ?? e.payload.toStageId;
      return `${from} → ${to} (Reason: ${e.payload.reason})`;
    }

    return e.payload.content;
  };

  const handleAddNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;

    // workspaceId/candidateId are safe here because we already passed guards
    addCandidateNote(workspaceId!, candidate.id, trimmed);

    setEvents(getCandidateTimeline(workspaceId!, candidate.id));
    setNoteText("");
  };

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

        <div style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Add note</h3>

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            style={{ width: "100%", resize: "vertical" }}
            placeholder="Write a note..."
          />

          <button type="button" onClick={handleAddNote} style={{ marginTop: 8 }}>
            Add note
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Timeline</h3>

          {events.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No events yet</p>
          ) : (
            <ul style={{ paddingLeft: 18 }}>
              {events.map((e) => (
                <li key={e.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {e.type} · {formatIso(e.createdAt)}
                  </div>
                  <div>{formatEventText(e)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};