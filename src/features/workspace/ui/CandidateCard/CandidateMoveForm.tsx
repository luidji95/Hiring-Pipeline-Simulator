import { useEffect, useMemo, useState } from "react";
import type { Stage, StageId } from "../../workspace.types";
import { moveCandidate } from "../../../storage/hpsStorage";

type Props = {
  workspaceId: string;
  candidateId: string;
  currentStageId: StageId;
  stages: Stage[];
  onSuccess: () => void;
  onCancel: () => void;
};

export const CandidateMoveForm = ({
  workspaceId,
  candidateId,
  currentStageId,
  stages,
  onSuccess,
  onCancel,
}: Props) => {
  const [toStageId, setToStageId] = useState<StageId>(currentStageId);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(
    () => stages.filter((s) => s.id !== currentStageId),
    [stages, currentStageId]
  );

  // Pick a default destination stage when the form opens
  useEffect(() => {
    if (options.length === 0) return;
    if (toStageId === currentStageId) setToStageId(options[0].id);
  }, [options, toStageId, currentStageId]);

  const handleSubmit = () => {
    try {
      setError(null);

      const trimmed = reason.trim();
      if (!trimmed) {
        setError("Reason is required.");
        return;
      }

      if (toStageId === currentStageId) {
        setError("Pick a different stage.");
        return;
      }

      moveCandidate(workspaceId, candidateId, toStageId, trimmed);

      setReason("");
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to move candidate.");
    }
  };

  return (
    <div style={{ border: "1px solid #333", padding: 10, borderRadius: 6 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <select value={toStageId} onChange={(e) => setToStageId(e.target.value as StageId)}>
          {options.map((s) => (
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
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={handleSubmit} style={{ flex: 1 }}>
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            setError(null);
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>

      {error ? <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>{error}</div> : null}
    </div>
  );
};