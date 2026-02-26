import type { Candidate } from "../../workspace.types";

type Props = {
  candidate: Candidate;
  onOpen: (candidateId: string) => void;
};

export const CandidateCard = ({ candidate, onOpen }: Props) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(candidate.id)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: 8,
        border: "1px solid #333",
        marginTop: 8,
        background: "transparent",
        color: "inherit",
        cursor: "pointer",
      }}
    >
      <div>
        {candidate.firstName} {candidate.lastName}
      </div>
      <div style={{ opacity: 0.7, fontSize: 12 }}>{candidate.title}</div>
    </button>
  );
};