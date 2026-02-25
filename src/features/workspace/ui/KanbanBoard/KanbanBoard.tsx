import type { WorkspaceInstance } from "../../workspace.types";
import { StageColumn } from "../StageColumn/StageColumn";

export const KanbanBoard = ({ instance }: { instance: WorkspaceInstance }) => {
 
  const visibleStages = instance.stages.filter((s) => !["new", "hired", "rejected"].includes(s.id));

  return (
    <div className="kanban">
      {visibleStages.map((stage) => (
        <StageColumn
          key={stage.id}
          stage={stage}
          candidateIds={instance.candidateIdsByStage[stage.id] ?? []}
          candidatesById={instance.candidatesById}
        />
      ))}
    </div>
  );
};

