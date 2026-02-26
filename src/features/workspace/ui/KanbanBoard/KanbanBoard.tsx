import { useNavigate } from "react-router-dom";
import type { WorkspaceInstance } from "../../workspace.types";
import { StageColumn } from "../StageColumn/StageColumn";

export const KanbanBoard = ({
  instance,
  workspaceId,
}: {
  instance: WorkspaceInstance;
  workspaceId: string;
}) => {
  const navigate = useNavigate();

  const visibleStages = instance.stages.filter(
    (s) => !["new", "hired", "rejected"].includes(s.id)
  );

  const handleOpenCandidate = (candidateId: string) => {
    navigate(`/workspace/${workspaceId}/candidate/${candidateId}`);
  };

  return (
    <div className="kanban">
      {visibleStages.map((stage) => (
        <StageColumn
          key={stage.id}
          stage={stage}
          candidateIds={instance.candidateIdsByStage[stage.id] ?? []}
          candidatesById={instance.candidatesById}
          onOpenCandidate={handleOpenCandidate}
        />
      ))}
    </div>
  );
};