import React from "react";
import { AlertTriangle } from "lucide-react";
import { clearWorkspaceCandidates } from "../../../storage/hpsStorage";
import { Button } from "../../../../ui-components";

type Props = {
  workspaceId: string;
  workspaceName: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export const ClearWorkspaceModal = React.forwardRef<HTMLDialogElement, Props>(
  ({ workspaceId, workspaceName, onSuccess, onCancel }, ref) => {
    const handleClearWorkspace = () => {
      try {
        clearWorkspaceCandidates(workspaceId);
        onSuccess();
      } catch (error) {
        console.error("Failed to clear workspace:", error);
      }
    };

    return (
      <dialog ref={ref} className="clear-workspace-modal">
        <div className="modal-overlay">
          <div className="modal-content clear-modal-content">
            <div className="clear-modal__icon">
              <AlertTriangle size={28} />
            </div>

            <h2 className="clear-modal__title">
              Clear pipeline for "{workspaceName}"?
            </h2>

            <p className="clear-modal__text">
              This action cannot be undone. All candidates and their timeline
              history will be permanently removed from this workspace.
            </p>

            <div className="clear-modal__actions">
              <Button
                type="button"
                className="btn-cancel"
                onClick={onCancel}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="btn-clear-confirm"
                onClick={handleClearWorkspace}
              >
                Clear Pipeline
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    );
  }
);

ClearWorkspaceModal.displayName = "ClearWorkspaceModal";