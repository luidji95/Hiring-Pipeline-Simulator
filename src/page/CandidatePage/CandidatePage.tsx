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
import "../CandidatePage/candidatePage.css";
import { Star } from "lucide-react";

type Params = {
  workspaceId: string;
  candidateId: string;
};

const formatIso = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("sr-RS", { 
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

  if (loading) return <div className="details-loading">Loading candidate profile...</div>;
  if (!candidate) return null;

const formatEventText = (e: CandidateEvent) => {
  if (e.type === "created") return "Candidate profile initialized";

  if (e.type === "stage_moved") {
    const from = stageLabelById?.[e.payload.fromStageId] ?? e.payload.fromStageId;
    const to = stageLabelById?.[e.payload.toStageId] ?? e.payload.toStageId;
    return (
      <span>
        Moved from <strong>{from}</strong> to <strong>{to}</strong>
        <br />
        <small className="event-reason">Reason: {e.payload.reason}</small>
      </span>
    );
  }

  if (e.type === "starred") {
    return (
      <span className="event-star event-star--active">
        <Star size={14} fill="gold" stroke="gold" />
        Candidate marked as priority
      </span>
    );
  }

  if (e.type === "unstarred") {
    return (
      <span className="event-star event-star--inactive">
        <Star size={14} fill="none" stroke="#999" />
        Candidate removed from priority
      </span>
    );
  }
  if (e.type === "updated") return "Candidate profile updated";

  return e.payload.content;
};

  const handleAddNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    addCandidateNote(workspaceId!, candidate.id, trimmed);
    setEvents(getCandidateTimeline(workspaceId!, candidate.id));
    setNoteText("");
  };

  return (
    <div className="details-page">
      <div className="details-nav">
        <Link to={`/workspace/${workspaceId}`} className="back-link">
          ← Back to {workspaceName}
        </Link>
      </div>

      <div className="details-container">
        {/* Header Sekcija */}
        <header className="details-header">
          <h2 className="candidate-full-name">
            {candidate.firstName} {candidate.lastName}
          </h2>
          <div className="candidate-meta">
            <span className="candidate-badge">{candidate.title}</span>
            {candidate.company && <span className="meta-item"> @ {candidate.company}</span>}
            {candidate.location && <span className="meta-item"> · {candidate.location}</span>}
          </div>
        </header>

        {/* Glavni Sadržaj - Grid */}
        <div className="details-grid">
          <section className="info-section">
            <h3 className="section-title">Contact & Links</h3>
            <div className="links-grid">
              <div className="link-item">
                <label>Email</label>
                <span>{candidate.email ?? "N/A"}</span>
              </div>
              <div className="link-item">
                <label>LinkedIn</label>
                {candidate.linkedinUrl ? <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer">View Profile</a> : <span>N/A</span>}
              </div>
              <div className="link-item">
                <label>GitHub</label>
                {candidate.githubUrl ? <a href={candidate.githubUrl} target="_blank" rel="noreferrer">Open Repo</a> : <span>N/A</span>}
              </div>
            </div>

            <h3 className="section-title">Tags</h3>
            <div className="tags-container">
              {candidate.tags?.length ? (
                candidate.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)
              ) : (
                <p className="empty-text">No tags assigned</p>
              )}
            </div>
          </section>

          <section className="timeline-section">
            <h3 className="section-title">Timeline & Activity</h3>
            
            <div className="note-input-container">
              <textarea
                className="note-textarea"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
                placeholder="Add internal feedback or interview notes..."
              />
              <button className="btn-add-note" onClick={handleAddNote}>
                Post Note
              </button>
            </div>

            <div className="timeline-list">
              {events.length === 0 ? (
                <p className="empty-text">No history found</p>
              ) : (
                events.map((e) => (
                  <div key={e.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="event-meta">
                      <span className="event-type">{e.type.replace('_', ' ')}</span>
                      <span className="event-date">{formatIso(e.createdAt)}</span>
                    </div>
                    <div className="event-content">{formatEventText(e)}</div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};