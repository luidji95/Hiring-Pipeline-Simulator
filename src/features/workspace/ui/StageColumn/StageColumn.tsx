import { CandidateCard } from "../CandidateCard/CandidateCard";
import type { Candidate, Stage } from "../../workspace.types";

type Props = {
  stage: Stage;
  candidateIds: string[];
  candidatesById: Record<string, Candidate>;
  onOpenCandidate: (candidateId: string) => void;
};

export const StageColumn = ({ stage, candidateIds, candidatesById, onOpenCandidate }: Props) => {
  return (
    <div className="stage">
      <h3>
        {stage.label} ({candidateIds.length})
      </h3>

      <div className="stage__list">
        {candidateIds.length === 0 ? (
          <p style={{ opacity: 0.6, fontSize: 12 }}>No candidates</p>
        ) : (
          candidateIds.map((id) => {
            const c = candidatesById[id];
            if (!c) return null;

            return <CandidateCard key={id} candidate={c} onOpen={onOpenCandidate} />;
          })
        )}
      </div>
    </div>
  );
};