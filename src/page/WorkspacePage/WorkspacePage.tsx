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
import { CandidateFormModal } from "../../features/workspace/ui/CandidateDialogs/CandidateFormModal";
import { DeleteCandidateModal } from "../../features/workspace/ui/CandidateDialogs/DeleteCandidateModal";
import { ClearWorkspaceModal } from "../../features/workspace/ui/CandidateDialogs/ClearWorkspaceModal";
import { MoveCandidateModal } from "../../features/workspace/ui/CandidateDialogs/MoveCandidateModal";
import {
  BoardControls,
  type BoardFilters,
  type BoardSortOption,
} from "../../features/workspace/ui/BoardControls/BoardControls";
import type { CandidateManualEntryFormData } from "../../schemas/candidate.validation";
import "../WorkspacePage/workspacepage.css";

export const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instance, setInstance] = useState<WorkspaceInstance | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [movingCandidate, setMovingCandidate] = useState<Candidate | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [deletingCandidate, setDeletingCandidate] = useState<Candidate | null>(null);

  const [filters, setFilters] = useState<BoardFilters>({
    location: "",
    tag: "",
    starredOnly: false,
  });

  const [sortBy, setSortBy] = useState<BoardSortOption>("newest");

  const createCandidateModalRef = useRef<HTMLDialogElement>(null);
  const moveCandidateModalRef = useRef<HTMLDialogElement>(null);
  const editCandidateModalRef = useRef<HTMLDialogElement>(null);
  const deleteCandidateModalRef = useRef<HTMLDialogElement>(null);
  const clearWorkspaceModalRef = useRef<HTMLDialogElement>(null);

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

  const handleOpenMoveCandidateModal = (candidate: Candidate) => {
    setMovingCandidate(candidate);
    moveCandidateModalRef.current?.showModal();
  };

  const handleCloseMoveCandidateModal = () => {
    moveCandidateModalRef.current?.close();
    setMovingCandidate(null);
  };

  const handleOpenEditCandidateModal = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    editCandidateModalRef.current?.showModal();
  };

  const handleCloseEditCandidateModal = () => {
    editCandidateModalRef.current?.close();
    setEditingCandidate(null);
  };

  const handleOpenDeleteCandidateModal = (candidate: Candidate) => {
    setDeletingCandidate(candidate);
    deleteCandidateModalRef.current?.showModal();
  };

  const handleCloseDeleteCandidateModal = () => {
    deleteCandidateModalRef.current?.close();
    setDeletingCandidate(null);
  };

  const handleOpenClearWorkspaceModal = () => {
    clearWorkspaceModalRef.current?.showModal();
  };

  const handleCloseClearWorkspaceModal = () => {
    clearWorkspaceModalRef.current?.close();
  };

  const handleClearAllControls = () => {
    setFilters({
      location: "",
      tag: "",
      starredOnly: false,
    });
    setSortBy("newest");
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

  const candidates = Object.values(instance.candidatesById);

  const availableLocations = Array.from(
    new Set(
      candidates
        .map((candidate) => candidate.location?.trim())
        .filter((location): location is string => Boolean(location))
    )
  ).sort((a, b) => a.localeCompare(b));

  const availableTags = Array.from(
    new Set(
      candidates.flatMap((candidate) =>
        (candidate.tags ?? []).map((tag) => tag.trim()).filter(Boolean)
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="workspacePage">
      <Topbar searchValue={searchTerm} onSearchChange={setSearchTerm} />

      <WorkspaceHeader
        name={instance.name}
        isDemo={!!instance.sourceTemplateId}
        onAddCandidate={handleOpenCreateCandidateModal}
        onClearPipeline={handleOpenClearWorkspaceModal}
      />

      <BoardControls
        filters={filters}
        sortBy={sortBy}
        availableLocations={availableLocations}
        availableTags={availableTags}
        onFiltersChange={setFilters}
        onSortChange={setSortBy}
        onClearAll={handleClearAllControls}
      />

      <div className="workspacePage__content">
        <KanbanBoard
          instance={instance}
          workspaceId={instance.id}
          searchTerm={searchTerm}
          filters={filters}
          sortBy={sortBy}
          onChange={reload}
          onMoveCandidate={handleOpenMoveCandidateModal}
          onEditCandidate={handleOpenEditCandidateModal}
          onDeleteCandidate={handleOpenDeleteCandidateModal}
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

      <MoveCandidateModal
        ref={moveCandidateModalRef}
        workspaceId={instance.id}
        candidate={movingCandidate}
        stages={instance.stages}
        onSuccess={() => {
          reload();
          handleCloseMoveCandidateModal();
        }}
        onCancel={handleCloseMoveCandidateModal}
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

      <DeleteCandidateModal
        ref={deleteCandidateModalRef}
        workspaceId={instance.id}
        candidate={deletingCandidate}
        onSuccess={() => {
          reload();
          handleCloseDeleteCandidateModal();
        }}
        onCancel={handleCloseDeleteCandidateModal}
      />

      <ClearWorkspaceModal
        ref={clearWorkspaceModalRef}
        workspaceId={instance.id}
        workspaceName={instance.name}
        onSuccess={() => {
          reload();
          handleCloseClearWorkspaceModal();
        }}
        onCancel={handleCloseClearWorkspaceModal}
      />
    </div>
  );
};