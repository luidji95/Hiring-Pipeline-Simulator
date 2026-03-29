import { useNavigate } from "react-router-dom";
import type { WorkspaceInstance, Candidate } from "../../workspace.types";
import { StageColumn } from "../StageColumn/StageColumn";
import "../KanbanBoard/kanban.css";

type Props = {
  instance: WorkspaceInstance;
  workspaceId: string;
  onChange: () => void;
  onEditCandidate: (candidate: Candidate) => void;
};

export const KanbanBoard = ({
  instance,
  workspaceId,
  onChange,
  onEditCandidate,
}: Props) => {
  const navigate = useNavigate();

  const visibleStages = instance.stages.filter(
    (s) => !["new", "hired", "rejected"].includes(s.id)
  );

  const handleOpenCandidate = (candidateId: string) => {
    navigate(`/workspace/${workspaceId}/candidate/${candidateId}`);
  };

  return (
    <div className="kanban-board">
      {visibleStages.map((stage) => (
        <StageColumn
          key={stage.id}
          stage={stage}
          candidateIds={instance.candidateIdsByStage[stage.id] ?? []}
          candidatesById={instance.candidatesById}
          onOpenCandidate={handleOpenCandidate}
          workspaceId={workspaceId}
          stages={instance.stages}
          onChange={onChange}
          onEditCandidate={onEditCandidate}
        />
      ))}
    </div>
  );
};