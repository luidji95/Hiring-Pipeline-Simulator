import { CandidateCard } from "../CandidateCard/CandidateCard";
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
  onEditCandidate: (candidate: Candidate) => void;
};

export const StageColumn = ({
  stage,
  candidateIds,
  candidatesById,
  onOpenCandidate,
  workspaceId,
  stages,
  onChange,
  onEditCandidate,
}: Props) => {
  const starredCandidateIds = candidateIds.filter(
    (id) => candidatesById[id]?.isStarred
  );

  const regularCandidateIds = candidateIds.filter(
    (id) => !candidatesById[id]?.isStarred
  );

  const displayCandidateIds = [...starredCandidateIds, ...regularCandidateIds];

  return (
    <div className="stage-column">
      <div className="stage-column__header">
        <h3 className="stage-column__title">
          {stage.label}{" "}
          <span className="stage-column__count">({candidateIds.length})</span>
        </h3>
      </div>

      <div className="stage-column__content">
        <div className="stage__list">
          {displayCandidateIds.length === 0 ? (
            <p className="no-candidates">No candidates</p>
          ) : (
            displayCandidateIds.map((id) => {
              const candidate = candidatesById[id];
              if (!candidate) return null;

              return (
                <CandidateCard
                  key={id}
                  candidate={candidate}
                  onOpen={onOpenCandidate}
                  workspaceId={workspaceId}
                  stages={stages}
                  onChange={onChange}
                  onEditCandidate={onEditCandidate}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};