

import "../CandidateCard/dragHandle.css";

type DragHandleProps = {
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export const DragHandle = ({ onDragStart, onDragEnd }: DragHandleProps) => {
  return (
    <div
      className="drag-handle"
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
    >
      <div className="drag-handle__dots">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="drag-handle__dot"></div>
        ))}
      </div>
    </div>
  );
};