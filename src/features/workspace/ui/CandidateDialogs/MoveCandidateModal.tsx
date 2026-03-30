import React, { useEffect, useMemo, useState } from "react";
import { moveCandidate } from "../../../storage/hpsStorage";
import type { Candidate, Stage, StageId } from "../../workspace.types";
import { Button } from "../../../../ui-components";


type Props = {
  workspaceId: string;
  candidate: Candidate | null;
  stages: Stage[];
  onSuccess: () => void;
  onCancel: () => void;
};

export const MoveCandidateModal = React.forwardRef<HTMLDialogElement, Props>(
  ({ workspaceId, candidate, stages, onSuccess, onCancel }, ref) => {
    const [toStageId, setToStageId] = useState<StageId | "">("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    const availableStages = useMemo(() => {
      if (!candidate) return [];
      return stages.filter((stage) => stage.id !== candidate.stageId);
    }, [stages, candidate]);

    useEffect(() => {
      if (!candidate || availableStages.length === 0) {
        setToStageId("");
        return;
      }

      setToStageId(availableStages[0].id);
      setReason("");
      setError(null);
    }, [candidate, availableStages]);

    const handleClose = () => {
      setReason("");
      setError(null);
      setToStageId(availableStages[0]?.id ?? "");
      onCancel();
    };

    const handleSubmit = () => {
      if (!candidate) return;

      const trimmedReason = reason.trim();

      if (!toStageId) {
        setError("Please select a destination stage.");
        return;
      }

      if (!trimmedReason) {
        setError("Reason is required.");
        return;
      }

      if (toStageId === candidate.stageId) {
        setError("Pick a different stage.");
        return;
      }

      try {
        setError(null);
        moveCandidate(workspaceId, candidate.id, toStageId, trimmedReason);
        onSuccess();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to move candidate.");
      }
    };

    return (
      <dialog ref={ref} className="move-candidate-modal">
        <div className="modal-overlay">
          <div className="modal-content move-modal-content">
            <div className="move-modal__header">
              <h2 className="move-modal__title">Move Candidate</h2>
            </div>

            {candidate ? (
              <>
                <div className="move-modal__summary">
                  <p className="move-modal__candidate">
                    {candidate.firstName} {candidate.lastName}
                  </p>
                  <p className="move-modal__current-stage">
                    Current stage: <strong>{stages.find((s) => s.id === candidate.stageId)?.label}</strong>
                  </p>
                </div>

                <div className="move-modal__body">
                  <label className="move-modal__label">
                    New stage
                    <select
                      className="move-modal__select"
                      value={toStageId}
                      onChange={(e) => setToStageId(e.target.value as StageId)}
                    >
                      {availableStages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="move-modal__label">
                    Reason
                    <textarea
                      className="move-modal__textarea"
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Add context for this stage transition..."
                    />
                  </label>

                  {error ? <p className="move-modal__error">{error}</p> : null}
                </div>

                <div className="move-modal__actions">
                  <Button
                    type="button"
                    className="btn-cancel"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    className="btn-submit"
                    onClick={handleSubmit}
                  >
                    Move Candidate
                  </Button>
                </div>
              </>
            ) : (
              <div className="move-modal__body">
                <p>No candidate selected.</p>
              </div>
            )}
          </div>
        </div>
      </dialog>
    );
  }
);

MoveCandidateModal.displayName = "MoveCandidateModal";