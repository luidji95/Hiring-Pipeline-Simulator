
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core";
import type { WorkspaceInstance, Candidate } from "../../workspace.types";
import { StageColumn } from "../StageColumn/StageColumn";
import { candidateMatchesSearch } from "../../utils/search";
import type {
  BoardFilters,
  BoardSortOption,
} from "../BoardControls/BoardControls";
import { DragHandle } from "../CandidateCard/DragHandle";
import { Star, Pencil, Trash2 } from "lucide-react";
import "../KanbanBoard/kanban.css";

import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

type Props = {
  instance: WorkspaceInstance;
  workspaceId: string;
  searchTerm: string;
  filters: BoardFilters;
  sortBy: BoardSortOption;
  onChange: () => void;
  onMoveCandidate: (candidate: Candidate, stageId?: string) => void;
  onEditCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
};

const HIDDEN_STAGE_IDS = ["new", "hired", "rejected"] as const;

const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

const candidateMatchesFilters = (
  candidate: Candidate,
  filters: BoardFilters
) => {
  const matchesLocation =
    !filters.location ||
    normalize(candidate.location) === normalize(filters.location);

  const matchesTag =
    !filters.tag ||
    (candidate.tags ?? []).some(
      (tag) => normalize(tag) === normalize(filters.tag)
    );

  const matchesStarred = !filters.starredOnly || Boolean(candidate.isStarred);

  return matchesLocation && matchesTag && matchesStarred;
};

const sortCandidates = (
  candidates: Candidate[],
  sortBy: BoardSortOption
): Candidate[] => {
  const sorted = [...candidates];

  switch (sortBy) {
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    case "name-asc":
      return sorted.sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        )
      );

    case "name-desc":
      return sorted.sort((a, b) =>
        `${b.firstName} ${b.lastName}`.localeCompare(
          `${a.firstName} ${a.lastName}`
        )
      );

    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
};

export const KanbanBoard = ({
  instance,
  workspaceId,
  searchTerm,
  filters,
  sortBy,
  onChange,
  onMoveCandidate,
  onEditCandidate,
  onDeleteCandidate,
}: Props) => {
  const navigate = useNavigate();
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

  const visibleStages = useMemo(() => {
    return instance.stages.filter(
      (stage) => !HIDDEN_STAGE_IDS.includes(stage.id)
    );
  }, [instance.stages]);

  const handleOpenCandidate = (candidateId: string) => {
    navigate(`/workspace/${workspaceId}/candidate/${candidateId}`);
  };

  const getVisibleCandidateIdsForStage = (
    stageId: keyof typeof instance.candidateIdsByStage
  ) => {
    const ids = instance.candidateIdsByStage[stageId] ?? [];

    const visibleCandidates = ids
      .map((id) => instance.candidatesById[id])
      .filter((candidate): candidate is Candidate => Boolean(candidate))
      .filter((candidate) => candidateMatchesSearch(candidate, searchTerm))
      .filter((candidate) => candidateMatchesFilters(candidate, filters));

    const sortedCandidates = sortCandidates(visibleCandidates, sortBy);

    return sortedCandidates.map((candidate) => candidate.id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidate = Object.values(instance.candidatesById).find(
      (c) => c.id === active.id
    );
    if (candidate) {
      setActiveCandidate(candidate);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCandidate(null);

    if (!over) return;

    const sourceColumnId = active.data.current?.sourceColumn;
    const targetColumnId = over.id;

    if (sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
      const candidate = Object.values(instance.candidatesById).find(
        (c) => c.id === active.id
      );
      
      if (candidate) {
        // Prosledi targetColumnId kao drugi argument
        onMoveCandidate(candidate, targetColumnId);
      }
    }
  };

  const hasAnyMatches = visibleStages.some(
    (stage) => getVisibleCandidateIdsForStage(stage.id).length > 0
  );

  const hasActiveControls =
    searchTerm.trim() ||
    filters.location ||
    filters.tag ||
    filters.starredOnly;

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {hasActiveControls && !hasAnyMatches ? (
          <div className="kanban-board__empty">
            No candidates match your current search and filters.
          </div>
        ) : (
          visibleStages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              candidateIds={getVisibleCandidateIdsForStage(stage.id)}
              candidatesById={instance.candidatesById}
              onOpenCandidate={handleOpenCandidate}
              workspaceId={workspaceId}
              onChange={onChange}
              onMoveCandidate={onMoveCandidate}
              onEditCandidate={onEditCandidate}
              onDeleteCandidate={onDeleteCandidate}
            />
          ))
        )}
      </div>
      
      <DragOverlay>
        {activeCandidate ? (
          <div className="drag-overlay">
            <div className="candidate-card dragging-overlay">
              <div className="candidate-card__header">
                <DragHandle />
                <div className="candidate-card__actions">
                  <Star size={16} />
                  <Pencil size={16} />
                  <Trash2 size={16} />
                </div>
              </div>
              <div className="candidate-card__info-btn">
                <div className="candidate-card__name">
                  {activeCandidate.firstName} {activeCandidate.lastName}
                </div>
                <div className="candidate-card__title">{activeCandidate.title}</div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};