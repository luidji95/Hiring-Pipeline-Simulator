import { useState } from "react";
import type { Candidate, Stage } from "../../workspace.types";
import { CandidateMoveForm } from "./CandidateMoveForm";
import "../CandidateCard/candidateCard.css";

type Props = {
  candidate: Candidate;
  onOpen: (candidateId: string) => void;

  workspaceId: string;
  stages: Stage[];
  onChange: () => void;
};

export const CandidateCard = ({ candidate, onOpen, workspaceId, stages, onChange }: Props) => {
  const [isMoving, setIsMoving] = useState(false);

  return (
    <div className="candidate-card">
      <button
        type="button"
        className="candidate-card__info-btn"
        onClick={() => onOpen(candidate.id)}
      >
        <div className="candidate-card__name">
          {candidate.firstName} {candidate.lastName}
        </div>
        <div className="candidate-card__title">{candidate.title}</div>
      </button>

      <div className="candidate-card__footer">
        {!isMoving ? (
          <button 
            type="button" 
            className="btn-move-trigger"
            onClick={() => setIsMoving(true)}
          >
            Move
          </button>
        ) : (
          <CandidateMoveForm
            workspaceId={workspaceId}
            candidateId={candidate.id}
            currentStageId={candidate.stageId}
            stages={stages}
            onSuccess={() => {
              onChange();
              setIsMoving(false);
            }}
            onCancel={() => setIsMoving(false)}
          />
        )}
      </div>
    </div>
  );
};