import { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { WorkspaceInstance } from "../../features/workspace/workspace.types";
import { getInstance } from "../../features/storage/hpsStorage";
import { KanbanBoard } from "../../features/workspace/ui/KanbanBoard/KanbanBoard";
import { Topbar } from "../../features/workspace/ui/Topbar/Topbar";
import { WorkspaceHeader } from "../../features/workspace/ui/WorkspaceHeader/WorkSpaceHeader";
import "../WorkspacePage/workspacepage.css";

export const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instance, setInstance] = useState<WorkspaceInstance | null>(null);

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

  if (!instance) return null;

 return (
  <div className="workspacePage">
    <Topbar />

    <WorkspaceHeader
      name={instance.name}
      isDemo={!!instance.sourceTemplateId}
    />

    <div className="workspacePage__content">
      <KanbanBoard
        instance={instance}
        workspaceId={instance.id}
        onChange={reload}
      />
    </div>
  </div>
);
};