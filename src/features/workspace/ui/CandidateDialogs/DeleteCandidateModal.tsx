import React from "react";
import type { Candidate } from "../../workspace.types";
import { deleteCandidate } from "../../../storage/hpsStorage";
import { Button } from "../../../../ui-components";
import { AlertTriangle } from "lucide-react";
import "../CandidateDialogs/deleteModal.css";

type Props = {
  workspaceId: string;
  candidate: Candidate | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export const DeleteCandidateModal = React.forwardRef<HTMLDialogElement, Props>(
  ({ workspaceId, candidate, onSuccess, onCancel }, ref) => {
    const handleDelete = () => {
      if (!candidate) return;

      try {
        deleteCandidate(workspaceId, candidate.id);
        onSuccess();
      } catch (error) {
        console.error("Failed to delete candidate:", error);
      }
    };

    return (
      <dialog ref={ref} className="delete-candidate-modal">
        <div className="modal-overlay">
          <div className="modal-content delete-modal-content">
            <div className="delete-modal__icon">
              <AlertTriangle size={28} />
            </div>

            <h2 className="delete-modal__title">
              Delete candidate{" "}
              {candidate ? `"${candidate.firstName} ${candidate.lastName}"` : ""}?
            </h2>

            <p className="delete-modal__text">
              This action cannot be undone. This candidate will be permanently
              deleted.
            </p>

            <div className="delete-modal__actions">
              <Button
                type="button"
                className="btn-cancel"
                onClick={onCancel}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="btn-delete-confirm"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    );
  }
);

DeleteCandidateModal.displayName = "DeleteCandidateModal";