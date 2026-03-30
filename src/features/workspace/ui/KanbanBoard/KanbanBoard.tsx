import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { WorkspaceInstance, Candidate } from "../../workspace.types";
import { StageColumn } from "../StageColumn/StageColumn";
import { candidateMatchesSearch } from "../../utils/search";
import "../KanbanBoard/kanban.css";

type Props = {
  instance: WorkspaceInstance;
  workspaceId: string;
  searchTerm: string;
  onChange: () => void;
  onEditCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
};

const HIDDEN_STAGE_IDS = ["new", "hired", "rejected"];

export const KanbanBoard = ({
  instance,
  workspaceId,
  searchTerm,
  onChange,
  onEditCandidate,
  onDeleteCandidate,
}: Props) => {
  const navigate = useNavigate();

  const visibleStages = useMemo(() => {
    return instance.stages.filter((stage) => !HIDDEN_STAGE_IDS.includes(stage.id));
  }, [instance.stages]);

  const handleOpenCandidate = (candidateId: string) => {
    navigate(`/workspace/${workspaceId}/candidate/${candidateId}`);
  };

  const getFilteredCandidateIds = (stageId: keyof typeof instance.candidateIdsByStage) => {
    const ids = instance.candidateIdsByStage[stageId] ?? [];

    return ids.filter((id) => {
      const candidate = instance.candidatesById[id];
      if (!candidate) return false;

      return candidateMatchesSearch(candidate, searchTerm);
    });
  };

  const hasAnyMatches = visibleStages.some(
    (stage) => getFilteredCandidateIds(stage.id).length > 0
  );

  return (
    <div className="kanban-board">
      {searchTerm.trim() && !hasAnyMatches ? (
        <div className="kanban-board__empty">
          No candidates match your search.
        </div>
      ) : (
        visibleStages.map((stage) => (
          <StageColumn
            key={stage.id}
            stage={stage}
            candidateIds={getFilteredCandidateIds(stage.id)}
            candidatesById={instance.candidatesById}
            onOpenCandidate={handleOpenCandidate}
            workspaceId={workspaceId}
            stages={instance.stages}
            onChange={onChange}
            onEditCandidate={onEditCandidate}
            onDeleteCandidate={onDeleteCandidate}
          />
        ))
      )}
    </div>
  );
};