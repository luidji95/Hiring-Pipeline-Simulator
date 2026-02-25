import type { Candidate, Stage } from "../../workspace.types";

export const StageColumn = ({
  stage,
}: {
  stage: Stage;
  candidateIds: string[];
  candidatesById: Record<string, Candidate>;
}) => {
  return (
    <div className="stage">
      <h3>{stage.label}</h3>
    </div>
  );
};