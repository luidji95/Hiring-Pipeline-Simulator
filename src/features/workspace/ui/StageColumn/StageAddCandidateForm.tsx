import { useState } from "react";
import type { StageId } from "../../workspace.types";
import { addCandidate } from "../../../storage/hpsStorage";
import "../StageColumn/stages.css";

type Props = {
  workspaceId: string;
  stageId: StageId;
  onSuccess: () => void;
  onCancel: () => void;
};

export const StageAddCandidateForm = ({ workspaceId, stageId, onSuccess, onCancel }: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    try {
      setError(null);
      const fn = firstName.trim();
      const ln = lastName.trim();
      const t = title.trim();

      if (!fn || !ln || !t) {
        setError("All fields are required.");
        return;
      }

      addCandidate(workspaceId, {
        firstName: fn,
        lastName: ln,
        title: t,
        stageId,
      });

      setFirstName("");
      setLastName("");
      setTitle("");
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add candidate.");
    }
  };

  return (
    <div className="add-candidate-form">
      <input
        className="form-input"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First name"
      />
      <input
        className="form-input"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last name"
      />
      <input
        className="form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (e.g. Frontend Dev)"
      />

      <div className="form-actions">
        <button type="button" className="btn-submit" onClick={handleSubmit}>
          Add
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}
    </div>
  );
};