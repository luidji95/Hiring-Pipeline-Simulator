import { CandidateCard } from "../CandidateCard/CandidateCard";
import type { Candidate, Stage } from "../../workspace.types";
import "../StageColumn/stages.css";

type Props = {
  stage: Stage;
  candidateIds: string[];
  candidatesById: Record<string, Candidate>;
  onOpenCandidate: (candidateId: string) => void;
  workspaceId: string;
  onChange: () => void;
  onMoveCandidate: (candidate: Candidate) => void;
  onEditCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
};

export const StageColumn = ({
  stage,
  candidateIds,
  candidatesById,
  onOpenCandidate,
  workspaceId,
  onChange,
  onMoveCandidate,
  onEditCandidate,
  onDeleteCandidate,
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
                  onChange={onChange}
                  onMoveCandidate={onMoveCandidate}
                  onEditCandidate={onEditCandidate}
                  onDeleteCandidate={onDeleteCandidate}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};