import { useMemo, useState } from "react";
import type { Candidate, Stage, StageId } from "../../workspace.types";
import { moveCandidate } from "../../../storage/hpsStorage"; 

type Props = {
  candidate: Candidate;
  onOpen: (candidateId: string) => void;

  workspaceId: string;
  stages: Stage[];
  onChange: () => void;
};

export const CandidateCard = ({ candidate, onOpen, workspaceId, stages, onChange }: Props) => {
  const [isMoving, setIsMoving] = useState(false);
  const [toStageId, setToStageId] = useState<StageId>(candidate.stageId);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const moveOptions = useMemo(
    () => stages.filter((s) => s.id !== candidate.stageId),
    [stages, candidate.stageId]
  );

  const handleConfirmMove = () => {
    try {
      setError(null);

      const trimmed = reason.trim();
      if (!trimmed) {
        setError("Reason is required.");
        return;
      }

      if (toStageId === candidate.stageId) {
        setError("Pick a different stage.");
        return;
      }

      moveCandidate(workspaceId, candidate.id, toStageId, trimmed);
      onChange(); // reload instance from storage

      setIsMoving(false);
      setReason("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to move candidate.");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #333",
        marginTop: 8,
        padding: 8,
        borderRadius: 6,
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(candidate.id)}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          background: "transparent",
          color: "inherit",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <div>
          {candidate.firstName} {candidate.lastName}
        </div>
        <div style={{ opacity: 0.7, fontSize: 12 }}>{candidate.title}</div>
      </button>

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        {!isMoving ? (
          <button type="button" onClick={() => {
            setIsMoving(true);
            setToStageId(moveOptions[0]?.id ?? candidate.stageId);
            setError(null);
          }}>
            Move
          </button>
        ) : (
          <>
            <select
              value={toStageId}
              onChange={(e) => setToStageId(e.target.value as StageId)}
            >
              {moveOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>

            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason..."
              style={{ flex: 1 }}
            />

            <button type="button" onClick={handleConfirmMove}>
              ✓
            </button>

            <button type="button" onClick={() => {
              setIsMoving(false);
              setReason("");
              setError(null);
            }}>
              ✕
            </button>
          </>
        )}
      </div>

      {error ? (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
          {error}
        </div>
      ) : null}
    </div>
  );
};