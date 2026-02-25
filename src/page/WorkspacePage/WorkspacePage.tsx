import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { WorkspaceInstance } from "../../features/workspace/workspace.types";
import { getInstance } from "../../features/storage/hpsStorage";
import { KanbanBoard } from "../../features/workspace/ui/KanbanBoard/KanbanBoard";

export const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instance, setInstance] = useState<WorkspaceInstance | null>(null);

  useEffect(() => {
    if (!id) return;

    const inst = getInstance(id);
    if (!inst) {
      navigate("/", { replace: true });
      return;
    }

    setInstance(inst);
  }, [id, navigate]);

  if (!instance) return null;

   return (
    <div>
      <Link to="/">Back</Link>
      <h2>{instance.name}</h2>
      <p>{instance.id}</p>
      <KanbanBoard instance={instance} />
    </div>
  );

};
