import { useState } from "react";
import type { Candidate, Stage } from "../../workspace.types";
import { CandidateMoveForm } from "./CandidateMoveForm";

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
    <div
      style={{
        border: "1px solid #333",
        marginTop: 8,
        padding: 10,
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

      <div style={{ marginTop: 10 }}>
        {!isMoving ? (
          <button type="button" onClick={() => setIsMoving(true)}>
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