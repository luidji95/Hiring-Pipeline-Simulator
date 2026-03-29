import { useEffect, useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  WorkspaceInstance,
  Candidate,
} from "../../features/workspace/workspace.types";
import { getInstance } from "../../features/storage/hpsStorage";
import { KanbanBoard } from "../../features/workspace/ui/KanbanBoard/KanbanBoard";
import { Topbar } from "../../features/workspace/ui/Topbar/Topbar";
import { WorkspaceHeader } from "../../features/workspace/ui/WorkspaceHeader/WorkSpaceHeader";
import { CandidateFormModal } from "../../features/workspace/ui/StageColumn/CandidateFormModal";
import type { CandidateManualEntryFormData } from "../../schemas/candidate.validation";
import "../WorkspacePage/workspacepage.css";

export const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instance, setInstance] = useState<WorkspaceInstance | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  const createCandidateModalRef = useRef<HTMLDialogElement>(null);
  const editCandidateModalRef = useRef<HTMLDialogElement>(null);

  const reload = useCallback(() => {
    if (!id) return;

    const inst = getInstance(id);
    if (!inst) {
      navigate("/", { replace: true });
      return;
    }

    setInstance(inst);
  }, [id, navigate]);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleOpenCreateCandidateModal = () => {
    createCandidateModalRef.current?.showModal();
  };

  const handleCloseCreateCandidateModal = () => {
    createCandidateModalRef.current?.close();
  };

  const handleOpenEditCandidateModal = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    editCandidateModalRef.current?.showModal();
  };

  const handleCloseEditCandidateModal = () => {
    editCandidateModalRef.current?.close();
    setEditingCandidate(null);
  };

  const getEditInitialValues = (
    candidate: Candidate | null
  ): Partial<CandidateManualEntryFormData> | undefined => {
    if (!candidate) return undefined;

    return {
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      title: candidate.title,
      email: candidate.email ?? "",
      linkedinUrl: candidate.linkedinUrl ?? "",
      githubUrl: candidate.githubUrl ?? "",
      location: candidate.location ?? "",
    };
  };

  if (!instance) return null;

  return (
    <div className="workspacePage">
      <Topbar />

      <WorkspaceHeader
        name={instance.name}
        isDemo={!!instance.sourceTemplateId}
        onAddCandidate={handleOpenCreateCandidateModal}
      />

      <div className="workspacePage__content">
        <KanbanBoard
          instance={instance}
          workspaceId={instance.id}
          onChange={reload}
          onEditCandidate={handleOpenEditCandidateModal}
        />
      </div>

      <CandidateFormModal
        ref={createCandidateModalRef}
        workspaceId={instance.id}
        stageId="screening"
        mode="create"
        initialValues={undefined}
        candidateId={undefined}
        onSuccess={() => {
          reload();
          handleCloseCreateCandidateModal();
        }}
        onCancel={handleCloseCreateCandidateModal}
      />

      <CandidateFormModal
        ref={editCandidateModalRef}
        workspaceId={instance.id}
        stageId={editingCandidate?.stageId ?? "screening"}
        mode="edit"
        candidateId={editingCandidate?.id}
        initialValues={getEditInitialValues(editingCandidate)}
        onSuccess={() => {
          reload();
          handleCloseEditCandidateModal();
        }}
        onCancel={handleCloseEditCandidateModal}
      />
    </div>
  );
};