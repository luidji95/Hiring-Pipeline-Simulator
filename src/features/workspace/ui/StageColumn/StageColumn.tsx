import { useState } from "react";
import { CandidateCard } from "../CandidateCard/CandidateCard";
import { StageAddCandidateForm } from "./StageAddCandidateForm";
import type { Candidate, Stage } from "../../workspace.types";

type Props = {
  stage: Stage;
  candidateIds: string[];
  candidatesById: Record<string, Candidate>;
  onOpenCandidate: (candidateId: string) => void;

  workspaceId: string;
  stages: Stage[];
  onChange: () => void;
};

export const StageColumn = ({
  stage,
  candidateIds,
  candidatesById,
  onOpenCandidate,
  workspaceId,
  stages,
  onChange,
}: Props) => {
  const [isAdding, setIsAdding] = useState(false);

  const canAddHere = stage.id === "screening"; // ONLY screening

  return (
    <div className="stage">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>
          {stage.label} ({candidateIds.length})
        </h3>

        {canAddHere ? (
          !isAdding ? (
            <button type="button" onClick={() => setIsAdding(true)}>
              + Add
            </button>
          ) : (
            <button type="button" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
          )
        ) : null}
      </div>

      {canAddHere && isAdding ? (
        <div style={{ marginTop: 10 }}>
          <StageAddCandidateForm
            workspaceId={workspaceId}
            stageId={stage.id}
            onSuccess={() => {
              onChange();
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : null}

      <div className="stage__list">
        {candidateIds.length === 0 ? (
          <p style={{ opacity: 0.6, fontSize: 12 }}>No candidates</p>
        ) : (
          candidateIds.map((id) => {
            const c = candidatesById[id];
            if (!c) return null;

            return (
              <CandidateCard
                key={id}
                candidate={c}
                onOpen={onOpenCandidate}
                workspaceId={workspaceId}
                stages={stages}
                onChange={onChange}
              />
            );
          })
        )}
      </div>
    </div>
  );
};