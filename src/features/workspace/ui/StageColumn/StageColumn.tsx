import { useState } from "react";
import { CandidateCard } from "../CandidateCard/CandidateCard";
import { StageAddCandidateForm } from "./StageAddCandidateForm";
import type { Candidate, Stage } from "../../workspace.types";
import "../StageColumn/stages.css";

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
  
  // Dozvoljavamo dodavanje samo u početnu fazu (screening)
  const canAddHere = stage.id === "screening";

  return (
    <div className="stage-column">
      <div className="stage-column__header">
        <h3 className="stage-column__title">
          {stage.label} <span className="stage-column__count">({candidateIds.length})</span>
        </h3>
        
        {canAddHere && (
          <button 
            type="button" 
            className="btn-add-candidate"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? "Cancel" : "+ Add"}
          </button>
        )}
      </div>

      <div className="stage-column__content">
        {canAddHere && isAdding && (
          <StageAddCandidateForm
            workspaceId={workspaceId}
            stageId={stage.id}
            onSuccess={() => {
              onChange();
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        )}

        <div className="stage__list">
          {candidateIds.length === 0 ? (
            <p className="no-candidates">No candidates</p>
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
    </div>
  );
};