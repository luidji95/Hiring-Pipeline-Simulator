import { useState } from "react";
import type { StageId } from "../../workspace.types";
import { addCandidate } from "../../../storage/hpsStorage";

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
        setError("First name, last name and title are required.");
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
    <div style={{ border: "1px solid #333", padding: 10, borderRadius: 6 }}>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First name"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last name"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (e.g. Frontend Dev)"
        style={{ width: "100%", marginBottom: 8 }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={handleSubmit} style={{ flex: 1 }}>
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setError(null);
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>

      {error ? <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>{error}</div> : null}
    </div>
  );
};