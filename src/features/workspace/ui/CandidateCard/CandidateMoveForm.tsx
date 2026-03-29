import { useEffect, useMemo, useState } from "react";
import type { Stage, StageId } from "../../workspace.types";
import { moveCandidate } from "../../../storage/hpsStorage";
import "../CandidateCard/candidateCard.css";

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
    <div className="candidate-move-form">
      <div className="move-form__row">
        <select
          className="move-form__select"
          value={toStageId}
          onChange={(e) => setToStageId(e.target.value as StageId)}
        >
          {options.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <input
          className="move-form__input"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason..."
        />
      </div>

      <div className="move-form__actions">
        <button
          type="button"
          className="btn-move-submit"
          onClick={handleSubmit}
        >
          Submit
        </button>

        <button
          type="button"
          className="btn-move-cancel"
          onClick={() => {
            setError(null);
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>

      {error ? <div className="move-form__error">{error}</div> : null}
    </div>
  );
};