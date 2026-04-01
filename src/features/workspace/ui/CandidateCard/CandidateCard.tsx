
import type { Candidate } from "../../workspace.types";
import "../CandidateCard/candidateCard.css";
import { Trash2, Star, Pencil } from "lucide-react";
import { toggleStar } from "../../../storage/hpsStorage";
import { DragHandle } from "./DragHandle";

type Props = {
  candidate: Candidate;
  onOpen: (candidateId: string) => void;
  workspaceId: string;
  onChange: () => void;
  onMoveCandidate: (candidate: Candidate) => void;
  onEditCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
};

export const CandidateCard = ({
  candidate,
  onOpen,
  workspaceId,
  onChange,
  onMoveCandidate,
  onEditCandidate,
  onDeleteCandidate,
  dragHandleProps,
}: Props) => {
  return (
    <div className="candidate-card">
      <div className="candidate-card__header">
        
        
        
        <div className="candidate-card__actions">
          <button
            type="button"
            className={`action-btn action-btn--star ${
              candidate.isStarred ? "active" : ""
            }`}
            title="Mark as priority"
            onClick={() => {
              toggleStar(workspaceId, candidate.id);
              onChange();
            }}
          >
            <Star
              size={16}
              fill={candidate.isStarred ? "gold" : "none"}
              stroke={candidate.isStarred ? "gold" : "currentColor"}
            />
          </button>

          <button
            type="button"
            className="action-btn action-btn--edit"
            title="Edit candidate"
            onClick={() => onEditCandidate(candidate)}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="action-btn action-btn--delete"
            title="Delete candidate"
            onClick={() => onDeleteCandidate(candidate)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="candidate-card__info-btn"
        onClick={() => onOpen(candidate.id)}
      >
        <div className="candidate-card__name">
          {candidate.firstName} {candidate.lastName}
        </div>
        <div className="candidate-card__title">{candidate.title}</div>
      </button>

      <div className="candidate-card__footer">
        <button
          type="button"
          className="btn-move-trigger"
          onClick={() => onMoveCandidate(candidate)}
        >
          Move
        </button>
        <div {...dragHandleProps}>
          <DragHandle />
        </div>
      </div>
    </div>
  );
};