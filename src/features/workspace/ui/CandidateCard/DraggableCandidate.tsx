
import { useDraggable } from "@dnd-kit/core";
import { CandidateCard } from "../CandidateCard/CandidateCard";
import type { Candidate } from "../../workspace.types";

type Props = {
  candidate: Candidate;
  sourceColumnId: string;
  onOpen: (candidateId: string) => void;
  workspaceId: string;
  onChange: () => void;
  onMoveCandidate: (candidate: Candidate, stageId?: string) => void;
  onEditCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
};

export const DraggableCandidate = ({
  candidate,
  sourceColumnId,
  onOpen,
  workspaceId,
  onChange,
  onMoveCandidate,
  onEditCandidate,
  onDeleteCandidate,
}: Props) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: candidate.id,
    data: {
      candidate,
      sourceColumn: sourceColumnId,
    },
  });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: isDragging ? 'scale(0.98)' : 'scale(1)',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <CandidateCard
        candidate={candidate}
        onOpen={onOpen}
        workspaceId={workspaceId}
        onChange={onChange}
        onMoveCandidate={onMoveCandidate}
        onEditCandidate={onEditCandidate}
        onDeleteCandidate={onDeleteCandidate}
        dragHandleProps={listeners}
      />
    </div>
  );
};